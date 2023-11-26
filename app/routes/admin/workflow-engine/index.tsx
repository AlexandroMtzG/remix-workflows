import { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowEngineIndexApi } from "~/modules/workflowEngine/routes/workflow-engine/index.api.server";
import WorkflowEngineIndexView from "~/modules/workflowEngine/routes/workflow-engine/index.view";

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;
export let loader = (args: LoaderArgs) => WorkflowEngineIndexApi.loader(args);
// export const action = (args: ActionArgs) => WorkflowEngineIndexApi.action(args);

export default () => <WorkflowEngineIndexView />;

export function ErrorBoundary() {
  return <ServerError />;
}
