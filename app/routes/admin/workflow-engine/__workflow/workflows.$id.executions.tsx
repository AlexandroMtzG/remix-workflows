import { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsIdExecutionsApi } from "~/modules/workflowEngine/routes/workflow-engine/__workflow/workflows.$id.executions.api.server";
import WorkflowsIdExecutionsView from "~/modules/workflowEngine/routes/workflow-engine/__workflow/workflows.$id.executions.view";
import reactFlowStyles from "reactflow/dist/style.css";

export function links() {
  return [{ rel: "stylesheet", href: reactFlowStyles }];
}
export const meta: V2_MetaFunction = ({ data }) => data?.metatags;
export let loader = (args: LoaderArgs) => WorkflowsIdExecutionsApi.loader(args);
// export const action = (args: ActionArgs) => WorkflowsIdExecutionsApi.action(args);

export default () => <WorkflowsIdExecutionsView />;

export function ErrorBoundary() {
  return <ServerError />;
}
