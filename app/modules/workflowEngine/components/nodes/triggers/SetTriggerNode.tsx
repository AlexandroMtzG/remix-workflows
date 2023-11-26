import { NodeProps } from "reactflow";

export default function SetTriggerNode(_: NodeProps) {
  return (
    <div className="h-20 w-64 rounded-md border border-dashed border-slate-300 bg-slate-100 ring-1 ring-blue-600 ring-offset-2">
      <div className="flex h-full flex-col justify-center space-y-1">
        <div className="text-center text-xs text-gray-500">Set a trigger in the sidebar</div>
      </div>
    </div>
  );
}
