import { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsIndexApi } from "~/modules/workflowEngine/routes/workflow-engine/workflows.index.api.server";
import WorkflowsIndexView from "~/modules/workflowEngine/routes/workflow-engine/workflows.index.view";

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;
export let loader = (args: LoaderArgs) => WorkflowsIndexApi.loader(args);
export const action = (args: ActionArgs) => WorkflowsIndexApi.action(args);

export default () => <WorkflowsIndexView />;

export function ErrorBoundary() {
  return <ServerError />;
}
