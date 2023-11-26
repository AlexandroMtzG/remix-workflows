import { Link, useParams, useSubmit } from "@remix-run/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import { Colors } from "~/application/enums/shared/Colors";
import MonacoEditor from "~/components/editors/MonacoEditor";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import BreadcrumbSimple from "~/components/ui/breadcrumbs/BreadcrumbSimple";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import WorkflowInputExamplesDropdown from "~/modules/workflowEngine/components/workflows/buttons/WorkflowInputExamplesDropdown";
import WorkflowRunDropdown from "~/modules/workflowEngine/components/workflows/buttons/WorkflowRunDropdown";
import { WorkflowBlockExecutionDto } from "~/modules/workflowEngine/dtos/WorkflowBlockExecutionDto";
import { WorkflowBlockTypes } from "~/modules/workflowEngine/dtos/WorkflowBlockTypes";
import { WorkflowExecutionDto } from "~/modules/workflowEngine/dtos/WorkflowExecutionDto";
import WorkflowUtils from "~/modules/workflowEngine/helpers/WorkflowUtils";
import UrlUtils from "~/utils/app/UrlUtils";
import { WorkflowsIdRunManualApi } from "./workflows.$id.run.manual.api.server";
import { WorkflowDto } from "../../../dtos/WorkflowDto";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";

export default function WorkflowsIdRunManualView() {
  const data = useTypedLoaderData<WorkflowsIdRunManualApi.LoaderData>();
  const actionData = useTypedActionData<WorkflowsIdRunManualApi.ActionData>();
  const params = useParams();
  const submit = useSubmit();

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [execution, setExecution] = useState<WorkflowExecutionDto | null>(null);
  const [inputData, setInputData] = useState("{}");

  useEffect(() => {
    if (data.workflow.inputExamples.length > 0) {
      setSelectedTemplate(data.workflow.inputExamples[0].title);
      setInputData(JSON.stringify(data.workflow.inputExamples[0].input, null, 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.workflow.inputExamples.length]);

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success);
    }

    if (actionData?.execution) {
      setExecution(actionData.execution);
      actionData?.execution?.executionAlerts.forEach((executionAlert) => {
        if (executionAlert.type === "error") {
          toast.error(executionAlert.message, {
            position: "bottom-right",
            duration: 10000,
          });
        } else {
          toast.success(executionAlert.message, {
            position: "bottom-right",
            duration: 10000,
          });
        }
      });
    }
  }, [actionData]);

  function onExecute() {
    const form = new FormData();
    form.append("action", "execute");
    form.append("input", inputData);
    submit(form, {
      method: "post",
    });
  }

  return (
    <div>
      <div className="w-full border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
        <BreadcrumbSimple
          menu={[{ title: "Workflows", routePath: UrlUtils.getModulePath(params, `workflow-engine/workflows`) }, { title: data.workflow.name }]}
        />
      </div>
      <div className="w-full border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
        <div className="flex justify-between">
          <Link
            to={UrlUtils.getModulePath(params, `workflow-engine/workflows/${data.workflow.id}/executions`)}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <span className="mr-1">&larr;</span> Back to executions
          </Link>
          <WorkflowRunDropdown workflow={data.workflow} />
        </div>
      </div>
      <div className="mx-auto max-w-2xl space-y-2 p-4">
        <div className="flex justify-between space-x-2">
          <div className="text-lg font-semibold">Run Workflow Manually</div>
        </div>

        {!execution ? (
          <div>
            <div className="space-y-1">
              <div className="flex items-center justify-between space-x-2">
                <div className="text-sm font-medium">{selectedTemplate || "Input Data"}</div>
                {data.workflow.inputExamples.length > 0 && (
                  <WorkflowInputExamplesDropdown
                    workflow={data.workflow}
                    onSelected={(item) => {
                      setSelectedTemplate(item.title);
                      setInputData(JSON.stringify(item.input, null, 2));
                    }}
                  />
                )}
              </div>
              <div className="overflow-hidden rounded-md border border-gray-200">
                <MonacoEditor className="h-20" theme="light" value={inputData} onChange={setInputData} hideLineNumbers tabSize={2} language="json" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <LoadingButton actionName="execute" onClick={onExecute} disabled={!WorkflowUtils.canRun(data.workflow)}>
                Run {!WorkflowUtils.canRun(data.workflow) && <span className="ml-1 text-xs opacity-50"> (not live)</span>}
              </LoadingButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link
                target="_blank"
                to={UrlUtils.getModulePath(params, `workflow-engine/workflows/${data.workflow.id}/executions?executionId=${execution.id}`)}
                className="flex w-full flex-col items-center rounded-lg border-2 border-dotted border-gray-300 bg-white p-3 text-sm font-medium hover:border-dashed hover:border-gray-800"
              >
                <>
                  <div className="flex justify-center">
                    <div className=" ">View execution flow</div>
                  </div>
                </>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setExecution(null);
                }}
                className="flex w-full flex-col items-center rounded-lg border-2 border-dotted border-gray-300 bg-white p-3 text-sm font-medium hover:border-dashed hover:border-gray-800"
              >
                <div className="flex justify-center">
                  <div className=" ">Run again</div>
                </div>
              </button>
            </div>
            <WorkflowRun workflow={execution} />
            <div className="font-medium text-gray-800">Blocks executed ({execution.blockRuns.length})</div>
            <div className="w-full space-y-1">
              {execution.blockRuns.map((blockRun) => {
                return <BlockRun key={blockRun.id} workflow={data.workflow} blockRun={blockRun} />;
              })}
            </div>
          </div>
        )}

        {actionData?.error && <ErrorBanner title="Error" text={actionData.error} />}
      </div>
    </div>
  );
}

function BlockRun({ workflow, blockRun }: { workflow: WorkflowDto; blockRun: WorkflowBlockExecutionDto }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const block = workflow.blocks.find((x) => x.id === blockRun.workflowBlockId);
  const workflowBlock = WorkflowBlockTypes.find((x) => x.value === block?.type);
  if (!block || !workflowBlock) {
    return null;
  }
  return (
    <div className="space-y-0">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          "cursor-pointer select-none overflow-hidden rounded-md border border-gray-200 bg-white p-2 hover:bg-gray-50",
          isExpanded ? "rounded-b-none" : "rounded-md"
        )}
      >
        <div className="flex justify-between space-x-2">
          <div className="flex items-center space-x-1 truncate">
            <div className="flex items-center space-x-2 truncate">
              <workflowBlock.icon className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <div className="flex-shrink-0 truncate text-xs font-medium text-gray-700">[{workflowBlock.name}]</div>
              {blockRun.error ? (
                <div className="truncate text-xs text-red-600">{blockRun.error}</div>
              ) : blockRun.output ? (
                <div className="truncate text-xs text-gray-500">{JSON.stringify({ output: blockRun.output })}</div>
              ) : null}
            </div>
            <div className="text-sm text-gray-500">{block.description || ""}</div>
          </div>

          <div className="flex-shrink-0">
            {block.type === "if" ? (
              <div>{blockRun.output?.condition ? <SimpleBadge title="True" color={Colors.BLUE} /> : <SimpleBadge title="False" color={Colors.ORANGE} />}</div>
            ) : (
              <div>
                {blockRun.status === "running" ? (
                  <SimpleBadge title="Running" color={Colors.YELLOW} />
                ) : blockRun.status === "error" ? (
                  <SimpleBadge title="Error" color={Colors.RED} />
                ) : blockRun.status === "success" ? (
                  <SimpleBadge title="Success" color={Colors.GREEN} />
                ) : (
                  <SimpleBadge title="Unknown Status" color={Colors.GRAY} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div onClick={(e) => e.preventDefault()} className="overflow-hidden rounded-md rounded-t-none border border-gray-200 bg-gray-100 p-2">
          {blockRun.error && <ErrorBanner title="Error" text={blockRun.error} />}
          <InputOutput input={blockRun.input} output={blockRun.output} />
        </div>
      )}
    </div>
  );
}

function WorkflowRun({ workflow }: { workflow: WorkflowExecutionDto }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className=" space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full flex-col items-center rounded-lg border-2 border-dotted border-gray-300 bg-white p-3 text-sm font-medium hover:border-dashed hover:border-gray-800"
      >
        <div className="flex justify-center"> Workflow Input and Output</div>
      </button>
      {isExpanded && (
        <div onClick={(e) => e.preventDefault()} className="overflow-hidden rounded-md border border-gray-200 bg-gray-100 p-2">
          <InputOutput input={workflow.input} output={workflow.output} />
        </div>
      )}
    </div>
  );
}

function InputOutput({ input, output }: { input?: any; output?: any }) {
  return (
    <div className="space-y-1">
      {!input || JSON.stringify(input) === "{}" ? (
        <div className="flex flex-col items-center border border-gray-300 bg-gray-200 p-3">
          <div className="text-center text-xs text-gray-600">No input</div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between space-x-2">
            <div className="text-xs font-medium text-gray-700">Input</div>
            <button
              type="button"
              className="text-xs font-medium text-gray-700 hover:text-gray-500"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(input))}
            >
              Copy
            </button>
          </div>
          <div className="prose max-h-24 overflow-auto">
            <pre>{JSON.stringify(input, null, 2)}</pre>
          </div>
        </div>
      )}

      {!output || JSON.stringify(output) === "{}" ? (
        <div className="flex flex-col items-center border border-gray-300 bg-gray-200 p-3">
          <div className="text-center text-xs text-gray-600">No output</div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between space-x-2">
            <div className="text-xs font-medium text-gray-700">Outputs</div>
            <button
              type="button"
              className="text-xs font-medium text-gray-700 hover:text-gray-500"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(output))}
            >
              Copy
            </button>
          </div>
          <div className="prose max-h-24 overflow-auto">
            <pre>{JSON.stringify(output, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
