import { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsTemplatesApi } from "~/modules/workflowEngine/routes/workflow-engine/templates.api.server";
import WorkflowsTemplatesView from "~/modules/workflowEngine/routes/workflow-engine/templates.view";

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;
export let loader = (args: LoaderArgs) => WorkflowsTemplatesApi.loader(args);
export const action = (args: ActionArgs) => WorkflowsTemplatesApi.action(args);

export default () => <WorkflowsTemplatesView />;

export function ErrorBoundary() {
  return <ServerError />;
}
