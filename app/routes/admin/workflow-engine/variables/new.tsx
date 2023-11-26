import { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsVariablesNewApi } from "~/modules/workflowEngine/routes/workflow-engine/variables/variables.new.api.server";
import WorkflowsVariablesNewView from "~/modules/workflowEngine/routes/workflow-engine/variables/variables.new.view";

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;
export let loader = (args: LoaderArgs) => WorkflowsVariablesNewApi.loader(args);
export const action = (args: ActionArgs) => WorkflowsVariablesNewApi.action(args);

export default () => <WorkflowsVariablesNewView />;

export function ErrorBoundary() {
  return <ServerError />;
}
