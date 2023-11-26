import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import UrlUtils from "~/utils/app/UrlUtils";
import { createWorkflowVariable, getWorkflowVariableByName } from "~/modules/workflowEngine/db/workflowVariable.db.server";
import { getTenantIdOrNull } from "~/utils/services/urlService";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";

export namespace WorkflowsVariablesNewApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
  };
  export let loader = ({}: LoaderArgs) => {
    const data: LoaderData = {
      metatags: [{ title: `New Workflows Variable | ${process.env.APP_NAME}` }],
    };
    return json(data);
  };
  export const action = async ({ request, params }: ActionArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });

    const form = await request.formData();
    const action = form.get("action")?.toString() ?? "";
    const name = form.get("name")?.toString() ?? "";
    const value = form.get("value")?.toString() ?? "";

    if (action === "create") {
      try {
        const existing = await getWorkflowVariableByName(name, { tenantId });
        if (existing) {
          throw Error("Variable already exists with name: " + name);
        }
        await createWorkflowVariable({
          tenantId,
          name,
          value,
        });
        return redirect(UrlUtils.getModulePath(params, `workflow-engine/variables`));
      } catch (e: any) {
        return json({ error: e.message }, { status: 400 });
      }
    }
    return json({ error: "Invalid action" }, { status: 400 });
  };
}
