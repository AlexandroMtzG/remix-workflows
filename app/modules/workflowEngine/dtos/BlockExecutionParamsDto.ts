import { WorkflowBlockDto } from "./WorkflowBlockDto";
import { WorkflowDto } from "./WorkflowDto";

export type BlockExecutionParamsDto = {
  workflow: WorkflowDto;
  workflowContext: { [key: string]: any };
  block: WorkflowBlockDto;
  workflowExecutionId: string;
  session: {
    tenantId: string | null;
    userId: string | null;
  };
};
