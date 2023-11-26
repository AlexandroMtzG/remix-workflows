import { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsVariablesApi } from "~/modules/workflowEngine/routes/workflow-engine/variables.api.server";
import WorkflowsVariablesView from "~/modules/workflowEngine/routes/workflow-engine/variables.view";

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;
export let loader = (args: LoaderArgs) => WorkflowsVariablesApi.loader(args);
// export const action = (args: ActionArgs) => WorkflowsVariablesApi.action(args);

export default () => <WorkflowsVariablesView />;

export function ErrorBoundary() {
  return <ServerError />;
}
