import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { db } from "~/utils/db.server";
import { getTenantIdOrNull } from "~/utils/services/urlService";

export namespace WorkflowEngineIndexApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    summary: {
      workflowsTotal: number;
      variablesTotal: number;
      executionsTotal: number;
    };
  };
  export let loader = async ({ request, params }: LoaderArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const data: LoaderData = {
      metatags: [{ title: `Workflows | ${process.env.APP_NAME}` }],
      summary: {
        workflowsTotal: await db.workflow.count({ where: { tenantId } }),
        variablesTotal: await db.workflowVariable.count({ where: { tenantId } }),
        executionsTotal: await db.workflowExecution.count({ where: { tenantId } }),
      },
    };
    return json(data);
  };
}
