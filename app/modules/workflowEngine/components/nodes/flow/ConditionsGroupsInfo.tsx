import { useState } from "react";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import { WorkflowConditionsGroupDto } from "~/modules/workflowEngine/dtos/WorkflowConditionDtos";
import ConditionsGroupInput from "./ConditionsGroupInput";
import { WorkflowBlockDto } from "~/modules/workflowEngine/dtos/WorkflowBlockDto";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import WorkflowConditionUtils from "~/modules/workflowEngine/helpers/WorkflowConditionUtils";
import clsx from "clsx";

export default function ConditionsGroupsInfo({
  workflow,
  block,
  type,
  onUpdateConditionsGroups,
}: {
  workflow: WorkflowDto;
  block: WorkflowBlockDto;
  type: "if";
  onUpdateConditionsGroups: (conditionsGroups: WorkflowConditionsGroupDto[]) => void;
}) {
  const [selectedConditionsGroup, setSelectedConditionsGroup] = useState<WorkflowConditionsGroupDto | null>(null);
  const [addingNewGroup, setAddingNewGroup] = useState(false);

  function onSaveGroup(conditionsGroup: WorkflowConditionsGroupDto) {
    if (conditionsGroup.index === block.conditionGroups.length) {
      onUpdateConditionsGroups([...block.conditionGroups, conditionsGroup]);
    } else {
      onUpdateConditionsGroups(block.conditionGroups.map((group) => (group.index === conditionsGroup.index ? conditionsGroup : group)));
    }
    setSelectedConditionsGroup(null);
    setAddingNewGroup(false);
  }
  return (
    <div className="space-y-1">
      {block.conditionGroups.map((group) => {
        return (
          <div key={group.index} className="space-y-0.5">
            <div
              onClick={() => setSelectedConditionsGroup(group)}
              className={clsx(
                "group relative cursor-pointer rounded-lg border border-dashed border-gray-500 px-2 py-2 text-sm hover:border-dotted focus:outline-none",
                group.conditions.length === 0
                  ? "border-red-300 bg-red-50 text-red-800 hover:border-red-800 hover:bg-red-100"
                  : "border-gray-300 bg-white hover:border-gray-800 hover:bg-gray-100"
              )}
            >
              <div className="space-y-0.5">
                {group.conditions.length === 0 ? (
                  <div>
                    <div className="font-medium">No conditions</div>
                  </div>
                ) : group.conditions.length === 1 ? (
                  <div className=" flex flex-col items-center justify-center rounded-md border border-gray-300 bg-gray-100 p-2 text-center">
                    <div key={group.index} className="flex items-center space-x-2">
                      <div className="font-medium">{WorkflowConditionUtils.getConditionString(group.conditions[0])}</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-medium">{group.conditions.length} conditions</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <SlideOverWideEmpty
        className="sm:max-w-2xl"
        title={!selectedConditionsGroup ? "" : type === "if" ? "If Condition" : `Case ${selectedConditionsGroup.index + 1}`}
        open={!!selectedConditionsGroup}
        onClose={() => setSelectedConditionsGroup(null)}
      >
        {selectedConditionsGroup && (
          <ConditionsGroupInput
            workflow={workflow}
            block={block}
            type={type}
            conditionsGroup={selectedConditionsGroup}
            onCancel={() => setSelectedConditionsGroup(null)}
            onSave={onSaveGroup}
          />
        )}
      </SlideOverWideEmpty>

      <SlideOverWideEmpty
        className="sm:max-w-2xl"
        title={"Add case " + (block.conditionGroups.length + 1)}
        open={addingNewGroup}
        onClose={() => setAddingNewGroup(false)}
      >
        {addingNewGroup && (
          <ConditionsGroupInput
            workflow={workflow}
            block={block}
            type={type}
            conditionsGroup={{
              index: block.conditionGroups.length,
              type: "AND",
              conditions: [],
            }}
            onCancel={() => setAddingNewGroup(false)}
            onSave={onSaveGroup}
          />
        )}
      </SlideOverWideEmpty>
    </div>
  );
}
