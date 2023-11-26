import { ActionArgs, json, LoaderFunction, redirect } from "@remix-run/node";
import { WorkflowsTemplateDto } from "~/modules/workflowEngine/dtos/WorkflowsTemplateDto";
import { getTenantIdOrNull } from "~/utils/services/urlService";
import WorkflowEngineTemplatesService from "~/modules/workflowEngine/services/WorkflowsTemplatesService";
import { getWorkflowById } from "~/modules/workflowEngine/db/workflows.db.server";
import WorkflowsService from "~/modules/workflowEngine/services/WorkflowsService";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import UrlUtils from "~/utils/app/UrlUtils";
import { getAllWorkflowVariables } from "~/modules/workflowEngine/db/workflowVariable.db.server";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";

export namespace WorkflowsIndexApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    items: WorkflowDto[];
    template: WorkflowsTemplateDto;
  };
  export let loader: LoaderFunction = async ({ request, params }) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const items = await WorkflowsService.getAll({ tenantId });
    const variables = await getAllWorkflowVariables({ tenantId });
    const data: LoaderData = {
      metatags: [{ title: `Workflows | ${process.env.APP_NAME}` }],
      items,
      template: await WorkflowEngineTemplatesService.getTemplate(items, variables),
    };
    return json(data);
  };

  export const action = async ({ request, params }: ActionArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const form = await request.formData();
    const action = form.get("action")?.toString();
    if (action === "toggle") {
      const id = form.get("id")?.toString() ?? "";
      const enabled = form.get("enabled")?.toString() === "true";

      const item = await getWorkflowById({ id, tenantId });
      if (!item) {
        return json({ error: "Not found" }, { status: 404 });
      }

      if (enabled && item.status === "draft") {
        await WorkflowsService.update(item.id, { status: "live" }, { tenantId });
      } else if (!enabled && item.status === "live") {
        await WorkflowsService.update(
          item.id,
          {
            status: "draft",
          },
          { tenantId }
        );
      }

      return json({ success: "Updated" });
    } else if (action === "create") {
      const { id } = await WorkflowsService.create({ tenantId });
      return redirect(UrlUtils.getModulePath(params, `workflow-engine/workflows/${id}`));
    } else if (action === "delete") {
      const id = form.get("id")?.toString() ?? "";
      await WorkflowsService.del(id, { tenantId });
      return redirect(UrlUtils.getModulePath(params, `workflow-engine/workflows`));
    } else {
      return json({ error: "Invalid form" }, { status: 400 });
    }
  };
}
