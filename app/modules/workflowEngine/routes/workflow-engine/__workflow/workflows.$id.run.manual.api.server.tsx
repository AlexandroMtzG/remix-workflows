import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import { WorkflowExecutionDto } from "~/modules/workflowEngine/dtos/WorkflowExecutionDto";
import WorkflowsExecutionsService from "~/modules/workflowEngine/services/WorkflowsExecutionsService";
import WorkflowsService from "~/modules/workflowEngine/services/WorkflowsService";
import UrlUtils from "~/utils/app/UrlUtils";
import { getTenantIdOrNull } from "~/utils/services/urlService";
import { getUserInfo } from "~/utils/session.server";

export namespace WorkflowsIdRunManualApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    workflow: WorkflowDto;
  };
  export let loader = async ({ request, params }: LoaderArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const workflow = await WorkflowsService.get(params.id!, {
      tenantId,
    });
    if (!workflow) {
      return redirect(UrlUtils.getModulePath(params, `workflow-engine/workflows`));
    }
    const data: LoaderData = {
      metatags: [{ title: `Run Workflow (Manual): ${workflow.name} | ${process.env.APP_NAME}` }],
      workflow,
    };
    return json(data);
  };

  export type ActionData = {
    success?: string;
    error?: string;
    execution?: WorkflowExecutionDto;
  };
  export const action = async ({ request, params }: ActionArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const { userId } = await getUserInfo(request);
    const form = await request.formData();
    const action = form.get("action")?.toString();
    if (action === "execute") {
      try {
        let input = form.get("input")?.toString() ?? "{}";
        let inputData: { [key: string]: any } | null = null;
        if (!input.trim()) {
          input = "{}";
        }
        if (input) {
          try {
            inputData = JSON.parse(input);
          } catch {
            throw Error("Input data is not valid JSON: " + input);
          }
        }
        const execution = await WorkflowsExecutionsService.execute(params.id!, {
          input: inputData,
          session: {
            tenantId,
            userId,
          },
        });
        if (execution.status === "error") {
          return json(
            {
              error: "Workflow execution failed: " + execution.error,
              execution,
            },
            { status: 400 }
          );
        }
        return json({ success: "Workflow executed", execution });
      } catch (e: any) {
        return json({ error: e.message }, { status: 400 });
      }
    }
    return json({ error: "Invalid action" }, { status: 400 });
  };
}
