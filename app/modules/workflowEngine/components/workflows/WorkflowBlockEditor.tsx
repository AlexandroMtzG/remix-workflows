import { useState, useEffect, Fragment, useRef } from "react";
import { WorkflowBlockDto } from "../../dtos/WorkflowBlockDto";
import { WorkflowBlockTypes, WorkflowBlockInput, WorkflowBlockOutput } from "../../dtos/WorkflowBlockTypes";
import { WorkflowConditionsGroupDto } from "../../dtos/WorkflowConditionDtos";
import { WorkflowDto } from "../../dtos/WorkflowDto";
import WorkflowBlockUtils from "../../helpers/WorkflowBlockUtils";
import WorkflowUtils from "../../helpers/WorkflowUtils";
import ConditionsGroupsInfo from "../nodes/flow/ConditionsGroupsInfo";
import WorkflowKeyValueInputs from "~/modules/workflowEngine/components/variables/WorkflowKeyValueInputs";
import WorkflowVariableTextInput from "../variables/WorkflowVariableTextInput";
import WorkflowVariableButton from "../variables/WorkflowVariableButton";
import { Editor } from "@monaco-editor/react";
import WorkflowBlockErrors from "./misc/WorkflowBlockErrors";
import InputCheckbox from "~/components/ui/input/InputCheckbox";
import { Link } from "@remix-run/react";

export default function WorkflowBlockEditor({
  workflow,
  block,
  onBack,
  onSaveBlock,
  onAddingNextBlock,
  onDeleteBlock,
  onDeleteConnection,
  onSelectedBlock,
  onUpdateConditionsGroups,
}: {
  workflow: WorkflowDto;

  block: WorkflowBlockDto;
  onBack: () => void;
  onSaveBlock: (block: WorkflowBlockDto) => void;
  onAddingNextBlock: ({ fromBlock, condition }: { fromBlock: WorkflowBlockDto; condition: string | null }) => void;
  onDeleteBlock: (blockId: string) => void;
  onDeleteConnection: (connection: { fromBlockId: string; toBlockId: string }) => void;
  onSelectedBlock: (workflowBlock: WorkflowBlockDto | null) => void;
  onUpdateConditionsGroups: (blockId: string, conditionGroups: WorkflowConditionsGroupDto[]) => void;
}) {
  const workflowBlock = WorkflowBlockTypes.find((x) => x.value === block.type);
  const [errors, setErrors] = useState<string[]>([]);
  useEffect(() => {
    setErrors(WorkflowBlockUtils.getBlockErrors({ workflow, block }));
  }, [workflow, block]);

  if (!workflowBlock) {
    return (
      <div>
        <div>Unknown block type: {block.type}</div>
        <button type="button" onClick={() => onDeleteBlock(block.id)}>
          Delete
        </button>
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

          <button
            type="button"
            onClick={() => onDeleteBlock(block.id)}
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
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
              <input
                className=" w-full rounded-lg px-1 py-1 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none"
                defaultValue={block.description}
                placeholder="Add a description..."
                // on click select all text
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                  // @ts-ignore
                  e.target.select();
                }}
                // onBlur or onEnter save
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
                onBlur={(e) => {
                  block.description = e.target.value;
                  onSaveBlock({
                    ...block,
                    description: e.target.value,
                  });
                }}
              />
            </div>
          </div>

          {errors.length > 0 && (
            <Fragment>
              <div className="border-t border-gray-200"></div>
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Errors</div>
                <WorkflowBlockErrors errors={errors} />
              </div>
            </Fragment>
          )}

          {workflowBlock.value === "if" && (
            <Fragment>
              <div className="border-t border-gray-200"></div>
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Conditions</div>
                <div className="space-y-1">
                  <ConditionsGroupsInfo workflow={workflow} block={block} type="if" onUpdateConditionsGroups={(i) => onUpdateConditionsGroups(block.id, i)} />
                </div>
              </div>
            </Fragment>
          )}

          {workflowBlock.inputs.length > 0 && (
            <Fragment>
              <div className="border-t border-gray-200"></div>
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Inputs</div>
                <div className="space-y-1">
                  {workflowBlock.inputs.map((input) => {
                    return (
                      <BlockInput
                        key={input.name}
                        workflow={workflow}
                        block={block}
                        input={input as WorkflowBlockInput}
                        onChange={(value) => {
                          block.input[input.name] = value;
                          onSaveBlock({
                            ...block,
                            input: {
                              ...block.input,
                              [input.name]: value,
                            },
                          });
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </Fragment>
          )}
          {workflowBlock.outputs.length > 0 && (
            <Fragment>
              <div className="border-t border-gray-200"></div>
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Outputs</div>
                <div className="space-y-1">
                  {WorkflowUtils.getVariables({ workflow, currentBlock: block, onlyInBlock: true }).map((output) => {
                    return <BlockOutput key={output.name} block={block} output={output as WorkflowBlockOutput} />;
                  })}
                </div>
              </div>
            </Fragment>
          )}
          <div className="border-t border-gray-200"></div>
          {block.type === "if" ? (
            <div className="space-y-3">
              <div className="space-y-0.5 text-sm">
                <div className="font-medium text-gray-700">Next blocks</div>
                <div className="text-gray-400">Add blocks that will run after this one.</div>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <NextBlockWithCondition
                    title="True"
                    block={block}
                    condition="true"
                    workflow={workflow}
                    onDeleteConnection={onDeleteConnection}
                    onAddingNextBlock={onAddingNextBlock}
                    onSelectedBlock={onSelectedBlock}
                  />
                  <NextBlockWithCondition
                    title="False"
                    block={block}
                    condition="false"
                    workflow={workflow}
                    onDeleteConnection={onDeleteConnection}
                    onAddingNextBlock={onAddingNextBlock}
                    onSelectedBlock={onSelectedBlock}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-0.5 text-sm">
                <div className="font-medium text-gray-700">Next block</div>
                <div className="text-gray-400">Add a block that will run after this one.</div>
              </div>
              <div className="space-y-1">
                {block.toBlocks.map(({ toBlockId }) => {
                  const nextWorkflowBlock = workflow.blocks.find((x) => x.id === toBlockId);
                  if (!nextWorkflowBlock) {
                    return <div key={toBlockId}>Unknown toBlockId: {toBlockId}</div>;
                  }
                  const workflowBlock = WorkflowBlockTypes.find((x) => x.value === nextWorkflowBlock.type);
                  if (!workflowBlock) {
                    return <div key={toBlockId}>Unknown block type: {nextWorkflowBlock.type}</div>;
                  }
                  return (
                    <button
                      type="button"
                      key={toBlockId}
                      className="group w-full rounded-lg border border-gray-300 bg-white p-2 text-left hover:bg-gray-50"
                      onClick={() => onSelectedBlock(nextWorkflowBlock)}
                    >
                      <div className="flex justify-between space-x-2 text-sm font-medium">
                        <div>
                          {workflowBlock.name}{" "}
                          {nextWorkflowBlock.description && <span className="text-xs font-normal text-gray-500">({nextWorkflowBlock.description || ""})</span>}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConnection({ fromBlockId: block.id, toBlockId });
                          }}
                          className="hidden flex-shrink-0 text-xs text-red-600 group-hover:block"
                        >
                          Disconnect
                        </button>
                      </div>
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="w-full rounded-lg border border-dashed border-gray-500 bg-white p-2 text-left text-sm font-medium hover:border-dotted hover:border-gray-800 hover:bg-gray-100"
                  onClick={() => onAddingNextBlock({ fromBlock: block, condition: null })}
                >
                  Add next block
                </button>
              </div>
            </div>
          )}

          <div></div>
        </div>
      </div>
    </div>
  );
}

function BlockInput({
  workflow,
  block,
  input,
  onChange,
}: {
  workflow: WorkflowDto;
  block: WorkflowBlockDto;
  input: WorkflowBlockInput;
  onChange: (value: string) => void;
}) {
  const refMonaco = useRef(null);

  const [inputValue, setInputValue] = useState<string | boolean | number>(
    block.input[input.name] === undefined ? input.defaultValue : block.input[input.name] || ""
  );
  const [debouncedInputValue, setDebouncedInputValue] = useState(block.input[input.name] || "");

  // Update debounced value after specified delay
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedInputValue(inputValue), 2000);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Call onChange with the debounced value
  useEffect(() => {
    if ((debouncedInputValue || "") !== (block.input[input.name] || "")) {
      onChange(debouncedInputValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInputValue, input.name]);

  function getKeyValueData() {
    try {
      return JSON.parse(block.input[input.name]) || {};
    } catch (e) {
      return {};
    }
  }
  return (
    <div key={input.name} className=" space-y-1">
      <div className="flex items-center justify-between space-x-2">
        <label htmlFor={"input-" + input.name} className="flex justify-between space-x-2 truncate text-xs font-medium text-gray-600">
          {input.label}{" "}
          {input.href && (
            <span className=" ml-1 font-normal underline">
              <Link to={input.href.url} target="_blank">
                ({input.href.label})
              </Link>
            </span>
          )}
        </label>
        {input.type === "monaco" && (
          <WorkflowVariableButton
            workflow={workflow}
            block={block}
            onSelected={(variable) => {
              if (refMonaco.current) {
                try {
                  // @ts-ignore
                  var selection = refMonaco.current.getSelection();
                  var id = { major: 1, minor: 1 };
                  var op = { identifier: id, range: selection, text: variable.name, forceMoveMarkers: true };
                  // @ts-ignore
                  refMonaco.current.executeEdits("my-source", [op]);
                } catch (e) {
                  setInputValue((prev) => {
                    return prev + variable.name;
                  });
                }
              } else {
                setInputValue((prev) => {
                  return prev + variable.name;
                });
              }
            }}
          />
        )}
        {/* <button
          type="button"
          onClick={() => {
            setInputValue("");
            onChange("");
          }}
          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Clear
        </button> */}
      </div>
      {input.type === "string" && (
        <WorkflowVariableTextInput
          name={input.name}
          placeholder={input.placeholder}
          workflow={workflow}
          block={block}
          value={inputValue as string}
          onChange={(e) => setInputValue(e)}
        />
      )}
      {input.type === "select" && (
        <select
          name={input.name}
          id={input.name}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-sm hover:bg-gray-100 focus:outline-none"
          value={inputValue as string}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={(e) => {
            if (e.target.value !== block.input[input.name]) {
              block.input[input.name] = e.target.value;
              onChange(e.target.value);
            }
          }}
        >
          <option value="">Select an option</option>
          {input.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {input.type === "monaco" && (
        <div className=" overflow-hidden">
          <Editor
            onMount={(editor: any, monaco: any) => {
              refMonaco.current = editor;
            }}
            value={inputValue as string}
            language="json"
            options={{
              fontSize: 12,
              renderValidationDecorations: "off",
              wordWrap: "on",
              unusualLineTerminators: "off",
              tabSize: 2,
            }}
            onChange={(e) => setInputValue(e?.toString() ?? "")}
            className="-ml-10 block h-32 w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
            theme="vs-dark"
          />
        </div>
      )}
      {input.type === "keyValue" && (
        <div>
          <WorkflowKeyValueInputs
            workflow={workflow}
            block={block}
            initialData={getKeyValueData()}
            onChange={(newData) => setInputValue(JSON.stringify(newData))}
          />
        </div>
      )}
      {input.type === "boolean" && (
        <InputCheckbox
          name={input.name}
          value={inputValue as boolean}
          setValue={(v) => {
            setInputValue(v as boolean);
          }}
        />
      )}
    </div>
  );
}

function BlockOutput({ block, output }: { block: WorkflowBlockDto; output: WorkflowBlockOutput }) {
  return (
    <div key={output.name}>
      <div className="flex items-center justify-between space-x-2">
        <label htmlFor={"output-" + output.name} className="mb-1 flex justify-between space-x-2 truncate text-xs font-medium text-gray-600">
          {output.label}
        </label>
      </div>
      <input
        name={output.name}
        id={output.name}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-sm hover:bg-gray-100 focus:outline-none"
        value={`${output.label} (${output.name})`}
        disabled
      />
    </div>
  );
}

function NextBlockWithCondition({
  title,
  block,
  condition,
  workflow,
  onDeleteConnection,
  onAddingNextBlock,
  onSelectedBlock,
}: {
  title: string;
  block: WorkflowBlockDto;
  condition: string;
  workflow: WorkflowDto;
  onDeleteConnection: (connection: { fromBlockId: string; toBlockId: string }) => void;
  onAddingNextBlock: ({ fromBlock, condition }: { fromBlock: WorkflowBlockDto; condition: string | null }) => void;
  onSelectedBlock: (workflowBlock: WorkflowBlockDto | null) => void;
}) {
  const nextBlock = block.toBlocks.find((x) => x.condition === condition);
  if (!nextBlock) {
    return (
      <div className="space-y-0.5">
        <label className="flex justify-between space-x-2 truncate text-xs font-medium uppercase text-gray-500">{title}</label>
        <button
          type="button"
          className="w-full rounded-lg border border-dashed border-red-300 bg-red-50 p-2 text-left text-sm font-medium text-red-800 hover:border-dotted hover:border-red-800 hover:bg-red-100"
          onClick={() => onAddingNextBlock({ fromBlock: block, condition })}
        >
          Add {title} block
        </button>
      </div>
    );
  }
  const nextWorkflowBlock = workflow.blocks.find((x) => x.id === nextBlock.toBlockId);
  if (!nextWorkflowBlock) {
    return <div>Unknown toBlockId: {nextBlock.toBlockId}</div>;
  }
  const workflowBlock = WorkflowBlockTypes.find((x) => x.value === nextWorkflowBlock.type);
  if (!workflowBlock) {
    return <div>Unknown block type: {nextWorkflowBlock.type}</div>;
  }
  return (
    <div className="space-y-0.5">
      <label className="flex justify-between space-x-2 truncate text-xs font-medium uppercase text-gray-500">{title}</label>
      <button
        type="button"
        onClick={() => onSelectedBlock(nextWorkflowBlock)}
        className="group w-full rounded-lg border border-gray-300 bg-white p-2 text-left hover:bg-gray-50"
      >
        <div className="flex justify-between space-x-2 text-sm font-medium">
          <div>
            {workflowBlock.name}{" "}
            {nextWorkflowBlock.description && <span className="text-xs font-normal text-gray-500">({nextWorkflowBlock.description || ""})</span>}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteConnection({ fromBlockId: block.id, toBlockId: nextBlock.toBlockId });
            }}
            className="hidden flex-shrink-0 text-xs text-red-600 group-hover:block"
          >
            Disconnect
          </button>
        </div>
      </button>
    </div>
  );
}
