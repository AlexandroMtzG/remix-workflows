import { Fragment } from "react";
import { WorkflowBlockDto } from "../../dtos/WorkflowBlockDto";
import { WorkflowBlockTypes } from "../../dtos/WorkflowBlockTypes";
import { WorkflowDto } from "../../dtos/WorkflowDto";
import { Editor } from "@monaco-editor/react";
import { WorkflowBlockExecutionDto } from "../../dtos/WorkflowBlockExecutionDto";
import DateUtils from "~/utils/shared/DateUtils";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";
import { WorkflowExecutionDto } from "../../dtos/WorkflowExecutionDto";

export default function WorkflowBlockExecution({
  workflow,
  block,
  blockRun,
  execution,
  onBack,
}: {
  workflow: WorkflowDto;
  block: WorkflowBlockDto;
  blockRun: WorkflowBlockExecutionDto | null;
  execution: WorkflowExecutionDto | null;
  onBack: () => void;
}) {
  const workflowBlock = WorkflowBlockTypes.find((x) => x.value === block.type);

  if (!workflowBlock) {
    return (
      <div>
        <div>Unknown block type: {block.type}</div>
      </div>
    );
  }
  return (
    <div>
      <div className="">
        <div className="flex h-12 justify-between border-b border-gray-200 px-4 py-3 pr-6">
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={onBack}
          >
            <span className="sr-only">Close panel</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 px-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <workflowBlock.icon className="h-5 w-5 text-indigo-500" />
              <div className="font-medium text-gray-700">{workflowBlock.name}</div>
            </div>
            <div>
              <div className="w-full rounded-lg bg-gray-100 px-1 py-1 text-sm text-gray-500 focus:outline-none">{block.description || "No description"}</div>
            </div>
          </div>

          {blockRun === null ? (
            <div>
              {execution ? (
                <div className="text-sm font-medium text-gray-700">Not executed</div>
              ) : (
                <div className="text-sm font-medium text-gray-700">Select a workflow execution to view the block run</div>
              )}
            </div>
          ) : (
            <Fragment>
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700">Status</div>
                  <div className="text-sm text-gray-500">{blockRun.status}</div>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700">Started</div>
                  <div className="text-sm text-gray-500">{DateUtils.dateAgo(blockRun.startedAt)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Ended</div>
                  <div className="text-sm text-gray-500">{DateUtils.dateAgo(blockRun.endedAt)}</div>
                </div>
              </div>

              {blockRun.error && <ErrorBanner title="Error" text={blockRun.error} />}

              {blockRun.input && (
                <Fragment>
                  <div className="border-t border-gray-200"></div>
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">Inputs</div>
                    <div className="space-y-1">
                      <div className="overflow-hidden">
                        <Editor
                          value={blockRun.input ? JSON.stringify(blockRun.input, null, 2) : "{}"}
                          language="json"
                          options={{
                            fontSize: 12,
                            renderValidationDecorations: "off",
                            wordWrap: "on",
                            unusualLineTerminators: "off",
                            tabSize: 2,
                          }}
                          className="-ml-10 block h-32 w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                          theme="vs-dark"
                        />
                      </div>
                    </div>
                  </div>
                </Fragment>
              )}
              {blockRun.output && (
                <Fragment>
                  <div className="border-t border-gray-200"></div>
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">Outputs</div>
                    <div className="space-y-1">
                      <div className="overflow-hidden">
                        <Editor
                          value={blockRun.input ? JSON.stringify(blockRun.output, null, 2) : "{}"}
                          language="json"
                          options={{
                            fontSize: 12,
                            renderValidationDecorations: "off",
                            wordWrap: "on",
                            unusualLineTerminators: "off",
                            tabSize: 2,
                          }}
                          className="-ml-10 block h-32 w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                          theme="vs-dark"
                        />
                      </div>
                    </div>
                  </div>
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
