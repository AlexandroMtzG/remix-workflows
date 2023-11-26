import { Link, useParams, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTypedLoaderData } from "remix-typedjson";
import BreadcrumbSimple from "~/components/ui/breadcrumbs/BreadcrumbSimple";
import WorkflowBuilder from "~/modules/workflowEngine/components/workflows/WorkflowBuilder";
import WorkflowExecutionsSidebar from "~/modules/workflowEngine/components/workflows/WorkflowExecutionsSidebar";
import WorkflowRunDropdown from "~/modules/workflowEngine/components/workflows/buttons/WorkflowRunDropdown";
import { WorkflowBlockDto } from "~/modules/workflowEngine/dtos/WorkflowBlockDto";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import { WorkflowExecutionDto } from "~/modules/workflowEngine/dtos/WorkflowExecutionDto";
import UrlUtils from "~/utils/app/UrlUtils";
import { WorkflowsIdExecutionsApi } from "./workflows.$id.executions.api.server";

export default function WorkflowsIdExecutionsView() {
  const data = useTypedLoaderData<WorkflowsIdExecutionsApi.LoaderData>();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const [workflow] = useState<WorkflowDto>(data.item);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecutionDto | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<WorkflowBlockDto | null>(null);

  useEffect(() => {
    const executionId = searchParams.get("executionId");
    if (executionId) {
      const execution = data.executions.find((x) => x.id === executionId);
      if (execution) {
        setSelectedExecution(execution);
      }
    } else {
      setSelectedExecution(null);
    }
  }, [data.executions, searchParams]);

  return (
    <div>
      <div className="w-full border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
        <BreadcrumbSimple menu={[{ title: "Workflows", routePath: UrlUtils.getModulePath(params, `workflow-engine/workflows`) }, { title: workflow.name }]} />
      </div>
      <div className="w-full border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
        <div className="flex justify-between">
          <Link
            to={UrlUtils.getModulePath(params, `workflow-engine/workflows/${workflow.id}`)}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <span className="mr-1">&larr;</span> Back to editor
          </Link>
          <WorkflowRunDropdown workflow={workflow} />
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        <div className="flex-1">
          <WorkflowBuilder
            key={selectedExecution?.id}
            readOnly={true}
            workflow={workflow}
            selectedBlock={selectedBlock}
            workflowExecution={selectedExecution}
            onSelectedBlock={setSelectedBlock}
          />
        </div>
        <div className="w-96 overflow-y-auto border-l border-gray-200 bg-white">
          <WorkflowExecutionsSidebar
            key={selectedExecution?.id}
            workflow={workflow}
            selectedBlock={selectedBlock}
            selectedExecution={selectedExecution}
            executions={data.executions}
            onSelectedBlock={setSelectedBlock}
            onSelectedExecution={setSelectedExecution}
          />
        </div>
      </div>
    </div>
  );
}
