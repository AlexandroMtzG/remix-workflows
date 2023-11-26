import { useEffect, useState } from "react";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import { WorkflowConditionOperators, WorkflowConditionsDto, WorkflowConditionsGroupDto } from "~/modules/workflowEngine/dtos/WorkflowConditionDtos";
import WorkflowConditionUtils from "~/modules/workflowEngine/helpers/WorkflowConditionUtils";
import WorkflowVariableTextInput from "../../variables/WorkflowVariableTextInput";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import { WorkflowBlockDto } from "~/modules/workflowEngine/dtos/WorkflowBlockDto";

function ConditionsGroupInput({
  workflow,
  block,
  type,
  conditionsGroup,
  onSave,
  onCancel,
}: {
  workflow: WorkflowDto;
  block: WorkflowBlockDto;
  type: "if";
  conditionsGroup: WorkflowConditionsGroupDto;
  onSave: (conditionsGroup: WorkflowConditionsGroupDto) => void;
  onCancel: () => void;
}) {
  const [conditions, setConditions] = useState<WorkflowConditionsDto[]>(
    conditionsGroup.conditions.length > 0
      ? conditionsGroup.conditions
      : [
          {
            index: 0,
            variable: "",
            operator: "isNotEmpty",
            value: "",
          },
        ]
  );
  const [errors, setErrors] = useState<{ condition: WorkflowConditionsDto; errors: string[] }[]>([]);
  const [conditionGroupType, setConditionGroupType] = useState<"AND" | "OR">(conditionsGroup.type);

  useEffect(() => {
    setErrors(WorkflowConditionUtils.getConditionsErrors(conditions));
  }, [conditions]);

  function updateConditionInGroup(idx: number, updatedCondition: WorkflowConditionsDto) {
    const operator = WorkflowConditionUtils.getOperator(updatedCondition.operator);
    if (!operator?.requiresValue) {
      updatedCondition.value = "";
    }
    setConditions(conditions.map((condition, i) => (i === idx ? updatedCondition : condition)));
  }
  function removeConditionFromGroup(idx: number) {
    setConditions(conditions.filter((_condition, i) => i !== idx));
  }
  function addConditionToGroup() {
    const newCondition: WorkflowConditionsDto = {
      index: conditions.length,
      variable: "",
      operator: "isNotEmpty",
      value: "",
    };
    setConditions([...conditions, newCondition]);
  }

  return (
    <div>
      {conditions.length === 0 ? (
        <div className=" flex flex-col items-center justify-center rounded-md border border-gray-300 bg-gray-100 p-2 text-center">
          <div className="text-sm font-medium text-gray-500">No conditions</div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex h-10 items-center justify-between space-x-2">
            {/* <div className="font-medium">{conditionsGroup.name}</div> */}
            {conditions.length === 1 ? <div className="font-medium">1 condition</div> : <div className="font-medium">{conditions.length} conditions</div>}
            {conditions.length > 1 && (
              <select
                value={conditionGroupType}
                onChange={(e) => setConditionGroupType(e.target.value as "AND" | "OR")}
                className="col-span-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 pr-10 text-sm hover:bg-gray-100 focus:outline-none"
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            )}
          </div>
          <div className="space-y-1 pb-2">
            {conditions.map((condition, idx) => (
              <div key={idx} className="group relative">
                <button
                  onClick={() => removeConditionFromGroup(idx)}
                  className="absolute right-2 top-2.5 hidden rounded-md text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 group-hover:block"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
                <div className="grid grid-cols-10 gap-1">
                  <WorkflowVariableTextInput
                    workflow={workflow}
                    block={block}
                    className="col-span-4"
                    name="variable"
                    placeholder="Variable"
                    value={condition.variable}
                    onChange={(e) => updateConditionInGroup(idx, { ...condition, variable: e })}
                  />
                  <select
                    className="col-span-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-sm hover:bg-gray-100 focus:outline-none"
                    value={condition.operator}
                    onChange={(e) => updateConditionInGroup(idx, { ...condition, operator: e.target.value as any })}
                  >
                    {WorkflowConditionOperators.map((operator) => {
                      return (
                        <option key={operator.value} value={operator.value}>
                          {operator.name}
                        </option>
                      );
                    })}
                  </select>
                  {/* <input
                    className="col-span-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg w-full px-2 py-2 text-sm focus:outline-none"
                    type="text"
                    placeholder="Value"
                    value={condition.value}
                    onChange={(e) => updateConditionInGroup(idx, { ...condition, value: e.target.value })}
                  /> */}
                  {WorkflowConditionUtils.getOperator(condition.operator)?.requiresValue && (
                    <WorkflowVariableTextInput
                      workflow={workflow}
                      block={block}
                      className="col-span-4"
                      name="value"
                      placeholder="Value"
                      value={condition.value}
                      onChange={(e) => updateConditionInGroup(idx, { ...condition, value: e })}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200">
        <div className="flex justify-between space-x-2 pt-2">
          <div>
            {/* <ButtonSecondary onClick={onCancel} className="mr-2">
              Cancel
            </ButtonSecondary> */}
            <ButtonSecondary
              onClick={() => addConditionToGroup()}
              // className="bg-gray-50 hover:bg-gray-100 border border-gray-300 px-2 py-1 rounded-md text-gray-600 text-xs"
            >
              + Condition
            </ButtonSecondary>
          </div>
          <div className="flex items-center space-x-1">
            <ButtonPrimary disabled={errors.length > 0} onClick={() => onSave({ ...conditionsGroup, conditions, type: conditionGroupType })}>
              Save
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConditionsGroupInput;
