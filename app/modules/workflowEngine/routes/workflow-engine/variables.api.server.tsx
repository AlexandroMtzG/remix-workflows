import { WorkflowVariable } from "@prisma/client";
import { json, LoaderArgs } from "@remix-run/node";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getAllWorkflowVariables } from "~/modules/workflowEngine/db/workflowVariable.db.server";
import { getTenantIdOrNull } from "~/utils/services/urlService";

export namespace WorkflowsVariablesApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    items: WorkflowVariable[];
  };
  export let loader = async ({ request, params }: LoaderArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const items = await getAllWorkflowVariables({ tenantId });
    const data: LoaderData = {
      metatags: [{ title: `Workflow Variables | ${process.env.APP_NAME}` }],
      items,
    };
    return json(data);
  };
}
