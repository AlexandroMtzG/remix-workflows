import { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsIdIndexApi } from "~/modules/workflowEngine/routes/workflow-engine/__workflow/workflows.$id.index.api.server";
import WorkflowsIdIndexView from "~/modules/workflowEngine/routes/workflow-engine/__workflow/workflows.$id.index.view";
import reactFlowStyles from "reactflow/dist/style.css";

export function links() {
  return [{ rel: "stylesheet", href: reactFlowStyles }];
}
export const meta: V2_MetaFunction = ({ data }) => data?.metatags;
export let loader = (args: LoaderArgs) => WorkflowsIdIndexApi.loader(args);
export const action = (args: ActionArgs) => WorkflowsIdIndexApi.action(args);

export default () => <WorkflowsIdIndexView />;

export function ErrorBoundary() {
  return <ServerError />;
}
