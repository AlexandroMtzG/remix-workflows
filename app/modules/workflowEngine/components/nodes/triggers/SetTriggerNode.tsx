import { NodeProps } from "reactflow";

export default function SetTriggerNode(_: NodeProps) {
  return (
    <div className="border border-slate-300 bg-slate-100 border-dashed w-64 h-20 rounded-md ring-1 ring-blue-600 ring-offset-2">
      <div className="flex flex-col justify-center h-full space-y-1">
        <div className="text-xs text-center text-gray-500">Set a trigger in the sidebar</div>
      </div>
    </div>
  );
}
