import { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowEngineApi } from "~/modules/workflowEngine/routes/workflow-engine.api.server";
import WorkflowEngineView from "~/modules/workflowEngine/routes/workflow-engine.view";

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;
export let loader = (args: LoaderArgs) => WorkflowEngineApi.loader(args);
// export const action = (args: ActionArgs) => WorkflowEngineApi.action(args);

export default () => <WorkflowEngineView />;

export function ErrorBoundary() {
  return <ServerError />;
}
