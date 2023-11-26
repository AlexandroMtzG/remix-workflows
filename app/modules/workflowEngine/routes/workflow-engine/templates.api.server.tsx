import { ActionFunction, json, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getAllWorkflows } from "~/modules/workflowEngine/db/workflows.db.server";
import { WorkflowsTemplateDto } from "~/modules/workflowEngine/dtos/WorkflowsTemplateDto";
import WorkflowEngineTemplatesService from "~/modules/workflowEngine/services/WorkflowsTemplatesService";
import UrlUtils from "~/utils/app/UrlUtils";
import { getTenantIdOrNull } from "~/utils/services/urlService";

export namespace WorkflowsTemplatesApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
  };
  export let loader = ({}: LoaderArgs) => {
    const data: LoaderData = {
      metatags: [{ title: `Workflow Templates | ${process.env.APP_NAME}` }],
    };
    return json(data);
  };
  export type ActionData = {
    previewTemplate?: WorkflowsTemplateDto;
    success?: string;
    error?: string;
  };
  export const action: ActionFunction = async ({ request, params }) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const form = await request.formData();
    const action = form.get("action")?.toString();

    if (action === "preview") {
      try {
        const template = JSON.parse(form.get("configuration")?.toString() ?? "{}") as WorkflowsTemplateDto;
        const allWorkflows = await getAllWorkflows({ tenantId });
        await Promise.all(
          template.workflows.map(async (workflow) => {
            const existing = allWorkflows.find((w) => w.name === workflow.name);
            if (existing) {
              throw Error("Workflow already exists with name: " + workflow.name);
            }
          })
        );
        const workflows = await WorkflowEngineTemplatesService.importWorkflows(template, {
          tenantId,
        });
        if (workflows.length === 0) {
          throw Error("Could not create workflow");
        }
        if (workflows.length === 1) {
          return redirect(UrlUtils.getModulePath(params, `workflow-engine/workflows/${workflows[0].id}`));
        }
        return json({
          success: `Created ${workflows.length} workflows`,
        });
      } catch (error: any) {
        return json({ error: error.message }, { status: 400 });
      }
    } else if (action === "create") {
      try {
        const template = JSON.parse(form.get("configuration")?.toString() ?? "{}") as WorkflowsTemplateDto;
        const workflows = await WorkflowEngineTemplatesService.importWorkflows(template, {
          tenantId,
        });
        if (workflows.length === 0) {
          throw Error("Could not create workflow");
        }
        return json({
          success: workflows.map((workflow) => {
            return {
              title: `Workflow "${workflow.name}" with ${workflow.blocks.length} blocks`,
              href: UrlUtils.getModulePath(params, `workflow-engine/workflows/${workflow.id}`),
            };
          }),
        });
      } catch (error: any) {
        return json({ error: error.message }, { status: 400 });
      }
    } else {
      return json({ error: "Invalid form" }, { status: 400 });
    }
  };
}
