import { WorkflowVariable } from "@prisma/client";
import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import UrlUtils from "~/utils/app/UrlUtils";
import { deleteWorkflowVariable, getWorkflowVariableById, updateWorkflowVariable } from "~/modules/workflowEngine/db/workflowVariable.db.server";
import { getTenantIdOrNull } from "~/utils/services/urlService";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";

export namespace WorkflowsVariablesIdApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    item: WorkflowVariable;
  };
  export let loader = async ({ request, params }: LoaderArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const item = await getWorkflowVariableById(params.id ?? "", { tenantId });
    if (!item) {
      return redirect(UrlUtils.getModulePath(params, `workflow-engine/variables`));
    }
    const data: LoaderData = {
      metatags: [{ title: `Edit Workflows Variable | ${process.env.APP_NAME}` }],
      item,
    };
    return json(data);
  };

  export const action = async ({ request, params }: ActionArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const existing = await getWorkflowVariableById(params.id ?? "", { tenantId });
    if (!existing) {
      return json({ error: "Not found" }, { status: 404 });
    }

    const form = await request.formData();
    const action = form.get("action")?.toString() ?? "";
    const value = form.get("value")?.toString() ?? "";

    if (action === "edit") {
      try {
        await updateWorkflowVariable(params.id ?? "", {
          value,
        });
        return redirect(UrlUtils.getModulePath(params, `workflow-engine/variables`));
      } catch (e: any) {
        return json({ error: e.message }, { status: 400 });
      }
    } else if (action === "delete") {
      await deleteWorkflowVariable(existing.id);
      return redirect(UrlUtils.getModulePath(params, `workflow-engine/variables`));
    }
    return json({ error: "Invalid action" }, { status: 400 });
  };
}
