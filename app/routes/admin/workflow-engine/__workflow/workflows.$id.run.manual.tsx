import { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsIdRunManualApi } from "~/modules/workflowEngine/routes/workflow-engine/__workflow/workflows.$id.run.manual.api.server";
import WorkflowsIdRunManualView from "~/modules/workflowEngine/routes/workflow-engine/__workflow/workflows.$id.run.manual.view";

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;
export let loader = (args: LoaderArgs) => WorkflowsIdRunManualApi.loader(args);
export const action = (args: ActionArgs) => WorkflowsIdRunManualApi.action(args);

export default () => <WorkflowsIdRunManualView />;

export function ErrorBoundary() {
  return <ServerError />;
}
