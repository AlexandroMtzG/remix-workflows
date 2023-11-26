import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { getFiltersFromCurrentUrl, getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import {
  deleteWorkflowExecution,
  getAllWorkflowExecutions,
  getWorkflowExecution,
  WorkflowExecutionWithDetails,
} from "~/modules/workflowEngine/db/workflowExecutions.db.server";
import { getWorkflowsIdsAndNames } from "~/modules/workflowEngine/db/workflows.db.server";
import { getTenantIdOrNull } from "~/utils/services/urlService";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";

export namespace WorkflowsExecutionsApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    items: WorkflowExecutionWithDetails[];
    pagination: PaginationDto;
    filterableProperties: FilterablePropertyDto[];
  };
  export let loader = async ({ request, params }: LoaderArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const filterableProperties: FilterablePropertyDto[] = [
      {
        name: "workflowId",
        title: "Workflow",
        manual: true,
        options: (await getWorkflowsIdsAndNames({ tenantId })).map((item) => {
          return {
            value: item.id,
            name: item.name,
          };
        }),
      },
      {
        name: "status",
        title: "Status",
        manual: true,
        options: ["running", "success", "error"].map((item) => {
          return { value: item, name: item };
        }),
      },
      {
        name: "type",
        title: "Type",
        manual: true,
        options: ["manual"].map((item) => {
          return { value: item, name: item };
        }),
      },
    ];
    const filters = getFiltersFromCurrentUrl(request, filterableProperties);
    const urlSearchParams = new URL(request.url).searchParams;
    const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);
    const { items, pagination } = await getAllWorkflowExecutions({
      tenantId,
      pagination: currentPagination,
      filters,
    });
    const data: LoaderData = {
      metatags: [{ title: `Workflow Executions | ${process.env.APP_NAME}` }],
      items,
      pagination,
      filterableProperties,
    };
    return json(data);
  };

  export const action = async ({ request, params }: ActionArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const form = await request.formData();
    const action = form.get("action")?.toString();

    if (action === "delete") {
      const id = form.get("id")?.toString() ?? "";
      const execution = getWorkflowExecution(id, { tenantId });
      if (!execution) {
        return json({ error: "Not found" }, { status: 404 });
      }
      await deleteWorkflowExecution(id);
      return json({ success: true });
    } else {
      return json({ error: "Invalid action" }, { status: 400 });
    }
  };
}
