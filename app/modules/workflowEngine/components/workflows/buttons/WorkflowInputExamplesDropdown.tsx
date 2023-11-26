import { Menu } from "@headlessui/react";
import clsx from "clsx";
import DropdownOptions from "~/components/ui/dropdowns/DropdownOptions";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import { WorkflowInputExampleDto } from "~/modules/workflowEngine/dtos/WorkflowInputExampleDto";

export default function WorkflowInputExamplesDropdown({
  workflow,
  onSelected,
}: {
  workflow: WorkflowDto;
  onSelected: (inputExample: WorkflowInputExampleDto) => void;
}) {
  return (
    <DropdownOptions
      width="w-80"
      button={<div className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium hover:bg-gray-50">Pick an example</div>}
      options={
        <div>
          {workflow.inputExamples.map((inputExample) => {
            return (
              <Menu.Item key={inputExample.id}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => onSelected(inputExample)}
                    className={clsx("w-full truncate text-left", active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")}
                  >
                    {inputExample.title}
                  </button>
                )}
              </Menu.Item>
            );
          })}
        </div>
      }
    ></DropdownOptions>
  );
}
