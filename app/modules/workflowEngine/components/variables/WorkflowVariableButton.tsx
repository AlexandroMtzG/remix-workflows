import { Fragment, useEffect, useState } from "react";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import WorkflowUtils from "../../helpers/WorkflowUtils";
import { WorkflowDto } from "../../dtos/WorkflowDto";
import { WorkflowBlockDto } from "../../dtos/WorkflowBlockDto";

export default function WorkflowVariableButton({
  workflow,
  block,
  onSelected,
}: {
  workflow: WorkflowDto;
  block: WorkflowBlockDto;
  onSelected: (variable: { name: string }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md border border-gray-300 bg-gray-50 p-1 text-xs font-medium text-gray-500 hover:bg-white hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.745 3A23.933 23.933 0 003 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 011.105.402l2.402 7.206a.75.75 0 001.104.401l1.445-.889m-8.25.75l.213.09a1.687 1.687 0 002.062-.617l4.45-6.676a1.688 1.688 0 012.062-.618l.213.09"
          />
        </svg>
      </button>
      <SlideOverWideEmpty className="sm:max-w-sm" title="Variables" open={isOpen} onClose={() => setIsOpen(false)}>
        <VariableList
          workflow={workflow}
          block={block}
          onSelected={(variable) => {
            onSelected(variable);
            setIsOpen(false);
          }}
        />
      </SlideOverWideEmpty>
    </Fragment>
  );
}

function VariableList({ workflow, block, onSelected }: { workflow: WorkflowDto; block: WorkflowBlockDto; onSelected: (variable: { name: string }) => void }) {
  const [groups, setGroups] = useState<{ name: string; variables: { name: string; label: string }[] }[]>([]);
  useEffect(() => {
    const variables = WorkflowUtils.getVariables({ workflow, currentBlock: block });
    const groups = variables.reduce<{ name: string; variables: { name: string; label: string }[] }[]>((acc, variable) => {
      const group = acc.find((x) => x.name === variable.group);
      if (group) {
        group.variables.push(variable);
      } else {
        acc.push({ name: variable.group, variables: [variable] });
      }
      return acc;
    }, []);
    let globalVariables = workflow.$variables ?? [];
    if (globalVariables.length > 0) {
      groups.unshift({
        name: "Global Variables",
        variables: globalVariables.map((f) => ({
          name: `{{$vars.${f}}}`,
          label: f,
        })),
      });
    }
    setGroups(groups);
  }, [workflow, block]);
  return (
    <div className="space-y-2">
      {groups.map((group, idx) => {
        return (
          <div key={idx} className="space-y-1">
            <div className="font-medium">{group.name}</div>
            <div className="space-y-1">
              {group.variables.map((variable) => (
                <button
                  type="button"
                  key={variable.name}
                  className="flex w-full items-center space-x-2 truncate rounded-md border border-gray-200 bg-white px-2 py-2 text-sm hover:bg-gray-50"
                  onClick={() => onSelected(variable)}
                >
                  <div>{variable.label}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
