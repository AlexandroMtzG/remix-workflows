import { useNavigate, useParams } from "@remix-run/react";
import WorkflowVariableForm from "~/modules/workflowEngine/components/workflowVariables/WorkflowVariableForm";
import UrlUtils from "~/utils/app/UrlUtils";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";

export default function WorkflowsVariablesNewView() {
  const params = useParams();
  const navigate = useNavigate();
  function close() {
    navigate(UrlUtils.getModulePath(params, `workflow-engine/variables`));
  }
  return (
    <SlideOverWideEmpty title="New Variable" className="sm:max-w-sm" open={true} onClose={close}>
      <WorkflowVariableForm />
    </SlideOverWideEmpty>
  );
}
