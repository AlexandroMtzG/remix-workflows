import { ActionArgs, LoaderArgs, json } from "@remix-run/node";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { db } from "~/utils/db.server";
import { getTenantIdOrNull } from "~/utils/services/urlService";
import { validateIsReadOnly } from "../../utils/WorkflowUtils";

export namespace WorkflowsDangerApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    summary: {
      workflows: number;
      variables: number;
      executions: number;
    };
  };
  export let loader = async ({ request, params }: LoaderArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const data: LoaderData = {
      metatags: [{ title: `Danger | Workflows | ${process.env.APP_NAME}` }],
      summary: {
        workflows: await db.workflow.count({ where: { tenantId } }),
        variables: await db.workflowVariable.count({ where: { tenantId } }),
        executions: await db.workflowExecution.count({ where: { tenantId } }),
      },
    };
    return json(data);
  };

  export type ActionData = {
    error?: string;
    success?: string;
  };
  export const action = async ({ request, params }: ActionArgs) => {
    const form = await request.formData();
    const tenantId = await getTenantIdOrNull({ request, params });

    validateIsReadOnly();
    const action = form.get("action")?.toString();
    if (action === "reset-all-data") {
      const workflows = await db.workflow.deleteMany({ where: { tenantId } });
      const variables = await db.workflowVariable.deleteMany({ where: { tenantId } });
      return json({ success: `Deleted ${workflows.count} workflows, and ${variables.count} variables.` });
    } else if (action === "delete-all-executions") {
      const executions = await db.workflowExecution.deleteMany({ where: { tenantId } });
      return json({ success: `Deleted ${executions.count} executions.` });
    } else if (action === "delete-all-variables") {
      const variables = await db.workflowVariable.deleteMany({ where: { tenantId } });
      return json({ success: `Deleted ${variables.count} variables.` });
    } else if (action === "delete-all-workflows") {
      const workflows = await db.workflow.deleteMany({ where: { tenantId } });
      return json({ success: `Deleted ${workflows.count} workflows.` });
    } else {
      return json({ error: "Invalid form" }, { status: 400 });
    }
  };
}
