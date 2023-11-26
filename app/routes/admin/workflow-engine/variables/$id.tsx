import { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsVariablesIdApi } from "~/modules/workflowEngine/routes/workflow-engine/variables/variables.$id.api.server";
import WorkflowsVariablesIdView from "~/modules/workflowEngine/routes/workflow-engine/variables/variables.$id.view";

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;
export let loader = (args: LoaderArgs) => WorkflowsVariablesIdApi.loader(args);
export const action = (args: ActionArgs) => WorkflowsVariablesIdApi.action(args);

export default () => <WorkflowsVariablesIdView />;

export function ErrorBoundary() {
  return <ServerError />;
}
