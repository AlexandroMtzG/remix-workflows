import { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsDangerApi } from "~/modules/workflowEngine/routes/workflow-engine/danger.api.server";
import WorkflowsDangerView from "~/modules/workflowEngine/routes/workflow-engine/danger.view";

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;
export let loader = (args: LoaderArgs) => WorkflowsDangerApi.loader(args);
export const action = (args: ActionArgs) => WorkflowsDangerApi.action(args);

export default () => <WorkflowsDangerView />;

export function ErrorBoundary() {
  return <ServerError />;
}
