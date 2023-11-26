import { useNavigate, useParams } from "@remix-run/react";
import WorkflowVariableForm from "~/modules/workflowEngine/components/workflowVariables/WorkflowVariableForm";
import UrlUtils from "~/utils/app/UrlUtils";
import { useTypedLoaderData } from "remix-typedjson";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import { WorkflowsVariablesIdApi } from "./variables.$id.api.server";

export default function WorkflowsVariablesIdView() {
  const data = useTypedLoaderData<WorkflowsVariablesIdApi.LoaderData>();
  const params = useParams();
  const navigate = useNavigate();
  function close() {
    navigate(UrlUtils.getModulePath(params, `workflow-engine/variables`));
  }
  return (
    <SlideOverWideEmpty title="Edit Variable" className="sm:max-w-sm" open={true} onClose={close}>
      <WorkflowVariableForm item={data.item} />
    </SlideOverWideEmpty>
  );
}
