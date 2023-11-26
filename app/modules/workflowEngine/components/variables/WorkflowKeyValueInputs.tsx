import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import WorkflowVariableTextInput from "~/modules/workflowEngine/components/variables/WorkflowVariableTextInput";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import { WorkflowBlockDto } from "~/modules/workflowEngine/dtos/WorkflowBlockDto";

export default function WorkflowKeyValueInputs({
  workflow,
  block,
  initialData,
  onChange,
}: {
  workflow: WorkflowDto;
  block: WorkflowBlockDto;
  initialData: {
    [key: string]: string;
  };
  onChange: (data: any) => void;
}) {
  const initialPairs = Object.keys(initialData).map((key) => ({
    id: uuidv4(),
    key,
    value: initialData[key],
  }));

  const [pairs, setPairs] = useState(initialPairs);

  const handleAddPair = () => {
    setPairs([...pairs, { id: uuidv4(), key: "", value: "" }]);
  };

  const handleKeyChange = (id: string, newKey: string) => {
    const updatedPairs = pairs.map((pair) => (pair.id === id ? { ...pair, key: newKey } : pair));
    setPairs(updatedPairs);
    triggerOnChange(updatedPairs);
  };

  const handleValueChange = (id: string, newValue: string) => {
    const updatedPairs = pairs.map((pair) => (pair.id === id ? { ...pair, value: newValue } : pair));
    setPairs(updatedPairs);
    triggerOnChange(updatedPairs);
  };

  const triggerOnChange = (updatedPairs: { id: string; key: string; value: string }[]) => {
    const newData = updatedPairs.reduce((acc: any, { key, value }) => ({ ...acc, [key]: value }), {});
    onChange(newData);
  };

  return (
    <div className="bg-gray-50 border border-gray-300 p-2 space-y-1 rounded-md">
      {pairs.map(({ id, key, value }) => (
        <div key={id} className="grid grid-cols-12 gap-1 truncate relative group">
          <button
            onClick={() => {
              const updatedPairs = pairs.filter((pair) => pair.id !== id);
              setPairs(updatedPairs);
              triggerOnChange(updatedPairs);
            }}
            className="absolute top-1.5 right-1 p-1 hidden group-hover:block"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
          <div className="p-0.5 col-span-6">
            <WorkflowVariableTextInput workflow={workflow} block={block} name="key" value={key} onChange={(e) => handleKeyChange(id, e)} placeholder="Key" />
          </div>
          <div className="p-0.5 col-span-6">
            <WorkflowVariableTextInput
              workflow={workflow}
              block={block}
              name="value"
              value={value}
              onChange={(e) => handleValueChange(id, e)}
              placeholder="Value"
            />
          </div>
        </div>
      ))}
      <button onClick={handleAddPair} className="bg-gray-50 hover:bg-gray-100 border border-gray-300 px-2 py-1 rounded-md text-gray-600 text-xs">
        Add
      </button>
    </div>
  );
}
