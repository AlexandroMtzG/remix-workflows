import { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsExecutionsApi } from "~/modules/workflowEngine/routes/workflow-engine/executions.api.server";
import WorkflowsExecutionsView from "~/modules/workflowEngine/routes/workflow-engine/executions.view";

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;
export let loader = (args: LoaderArgs) => WorkflowsExecutionsApi.loader(args);
export const action = (args: ActionArgs) => WorkflowsExecutionsApi.action(args);

export default () => <WorkflowsExecutionsView />;

export function ErrorBoundary() {
  return <ServerError />;
}
