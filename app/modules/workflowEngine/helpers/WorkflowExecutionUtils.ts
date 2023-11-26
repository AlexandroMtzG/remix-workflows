import { WorkflowExecutionWithDetails } from "../db/workflowExecutions.db.server";
import { WorkflowBlockExecutionDto } from "../dtos/WorkflowBlockExecutionDto";
import { WorkflowExecutionDto } from "../dtos/WorkflowExecutionDto";

function rowToDto(item: WorkflowExecutionWithDetails): WorkflowExecutionDto {
  const execution: WorkflowExecutionDto = {
    id: item.id,
    createdAt: item.createdAt,
    status: item.status as WorkflowExecutionDto["status"],
    input: parseData(item.input),
    output: parseData(item.output),
    duration: item.duration,
    endedAt: item.endedAt,
    error: item.error,
    blockRuns: item.blockRuns.map((block) => {
      const blockRun: WorkflowBlockExecutionDto = {
        id: block.id,
        workflowBlockId: block.workflowBlockId,
        fromWorkflowBlockId: block.fromWorkflowBlockId,
        status: block.status as WorkflowBlockExecutionDto["status"],
        startedAt: block.startedAt,
        endedAt: block.endedAt,
        input: parseData(block.input),
        output: parseData(block.output),
        error: block.error,
        workflowBlock: {
          type: block.workflowBlock.type as WorkflowBlockExecutionDto["workflowBlock"]["type"],
          description: block.workflowBlock.description,
        },
      };
      return blockRun;
    }),
    executionAlerts: [],
  };
  const alertUserBlockRuns = execution.blockRuns.filter((block) => block.workflowBlock.type === "alertUser");
  alertUserBlockRuns.forEach((blockRun) => {
    if (blockRun.output?.type && blockRun.output?.message) {
      execution.executionAlerts.push({
        type: blockRun.output?.type,
        message: blockRun.output?.message,
      });
    }
  });

  return execution;
}

function parseData(data: string | null): { [key: string]: any } | null {
  if (!data) {
    return null;
  }
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export default {
  rowToDto,
};
