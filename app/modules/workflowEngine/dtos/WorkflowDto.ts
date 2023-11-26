import { WorkflowBlockDto } from "./WorkflowBlockDto";
import { WorkflowInputExampleDto } from "./WorkflowInputExampleDto";

export type WorkflowDto = {
  id: string;
  tenantId: string | null;
  name: string;
  description: string;
  status: "draft" | "live" | "archived";
  createdAt: Date;
  updatedAt: Date | null;
  blocks: WorkflowBlockDto[];
  inputExamples: WorkflowInputExampleDto[];
  _count: {
    executions: number;
  };
  $variables?: string[];
  readOnly?: boolean;
};
