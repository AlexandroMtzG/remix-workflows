import { LoaderArgs, json, redirect } from "@remix-run/node";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import { WorkflowExecutionDto } from "~/modules/workflowEngine/dtos/WorkflowExecutionDto";
import WorkflowsService from "~/modules/workflowEngine/services/WorkflowsService";
import UrlUtils from "~/utils/app/UrlUtils";
import { getTenantIdOrNull } from "~/utils/services/urlService";

export namespace WorkflowsIdExecutionsApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    item: WorkflowDto;
    executions: WorkflowExecutionDto[];
  };
  export let loader = async ({ request, params }: LoaderArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const item = await WorkflowsService.get(params.id!, { tenantId });
    if (!item) {
      return redirect(UrlUtils.getModulePath(params, `workflow-engine/workflows`));
    }
    const executions = await WorkflowsService.getExecutions(item, { tenantId });
    const data: LoaderData = {
      metatags: [{ title: `Workflow Executions: ${item.name} | ${process.env.APP_NAME}` }],
      item,
      executions,
    };
    return json(data);
  };
}
