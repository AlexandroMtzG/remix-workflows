import { createContext } from "react";

const WorkflowContext = createContext<{
  isReadOnly: boolean;
  onEdgeDelete: (edgeId: string) => void;
  onNodeDelete: (nodeId: string) => void;
  isNodeSelected: (nodeId: string) => boolean;
}>({
  isReadOnly: false,
  onEdgeDelete: (edgeId) => {},
  onNodeDelete: (nodeId) => {},
  isNodeSelected: (nodeId) => false,
});
export default WorkflowContext;
