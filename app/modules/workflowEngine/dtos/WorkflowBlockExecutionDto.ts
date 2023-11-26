import { WorkflowBlockType } from "./WorkflowBlockTypes";
import { WorkflowStatus } from "./WorkflowStatus";

export type WorkflowBlockExecutionDto = {
  id: string;
  workflowBlockId: string;
  fromWorkflowBlockId: string | null;
  status: WorkflowStatus;
  startedAt: Date;
  endedAt: Date | null;
  input: { [key: string]: any } | null;
  output: { [key: string]: any } | null;
  error: string | null;
  workflowBlock: {
    type: WorkflowBlockType;
    description: string;
  };
};
