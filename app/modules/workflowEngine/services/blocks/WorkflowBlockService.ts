import { db } from "~/utils/db.server";
import { WorkflowBlockDto } from "../../dtos/WorkflowBlockDto";
import { WorkflowDto } from "../../dtos/WorkflowDto";
import { WorkflowBlockTypes } from "../../dtos/WorkflowBlockTypes";
import { parseVariable } from "../WorkflowsVariablesService";
import WorkflowsConditionsService from "../WorkflowsConditionsService";
import WorkflowConditionUtils from "../../helpers/WorkflowConditionUtils";
import { BlockExecutionResultDto } from "../../dtos/BlockExecutionResultDto";
import WorkflowUtils from "../../helpers/WorkflowUtils";
import { BlockExecutionParamsDto } from "../../dtos/BlockExecutionParamsDto";
import { WorkflowStatus } from "../../dtos/WorkflowStatus";
import WorkflowsValidationService from "../WorkflowsValidationService";

async function execute({
  workflowContext,
  workflowExecutionId,
  workflow,
  block,
  fromBlock,
  session,
}: {
  workflowContext: { [key: string]: any };
  workflowExecutionId: string;
  workflow: WorkflowDto;
  block: WorkflowBlockDto;
  fromBlock: WorkflowBlockDto | null;
  session: {
    tenantId: string | null;
    userId: string | null;
  };
}): Promise<{
  status: WorkflowStatus;
  workflowContext: { [key: string]: any };
}> {
  if (!WorkflowUtils.canRun(workflow)) {
    throw new Error("Workflow is not ready to run");
  }
  const workflowBlock = WorkflowBlockTypes.find((f) => f.value === block.type);
  if (!workflowBlock) {
    throw new Error("Invalid workflow block type: " + block.type);
  }

  let error: string | null = null;
  let blockExecution = await db.workflowBlockExecution.create({
    data: {
      workflowExecutionId,
      workflowBlockId: block.id,
      fromWorkflowBlockId: fromBlock ? fromBlock.id : null,
      status: "pending",
      startedAt: new Date(),
      input: block.input ? JSON.stringify(block.input) : null,
      output: null,
      endedAt: null,
      duration: null,
      error: null,
    },
  });

  const blockStartTime = performance.now();
  let result: BlockExecutionResultDto | null = {
    output: null,
    toBlockIds: [],
    error: null,
  };
  try {
    result = await executeBlock({ block, workflowContext, workflow, workflowExecutionId, session });
    workflowContext = {
      ...workflowContext,
      [block.variableName]: result.output,
    };
  } catch (e: any) {
    if (!result) {
      result = {
        error: e.message,
        output: null,
        toBlockIds: [],
      };
    } else {
      result.error = e.message;
    }
  }

  const blockEndTime = performance.now();
  const blockDuration = blockEndTime - blockStartTime;

  await db.workflowBlockExecution.update({
    where: { id: blockExecution.id },
    data: {
      output: result.output ? JSON.stringify(result.output) : null,
      status: result.error ? "error" : "success",
      duration: Math.round(blockDuration),
      endedAt: new Date(),
      error: result.error,
    },
  });

  if (result.error && result.throwsError) {
    throw new Error(result.error);
  }

  for (const nextBlockId of result.toBlockIds) {
    const toBlock = workflow.blocks.find((f) => f.id === nextBlockId);
    if (toBlock) {
      const result = await execute({ workflowContext, workflowExecutionId, workflow, block: toBlock, fromBlock: block, session });
      workflowContext = {
        ...workflowContext,
        ...result.workflowContext,
      };
    }
  }

  return {
    status: error ? "error" : "success",
    workflowContext: workflowContext,
  };
}

async function executeBlock(args: BlockExecutionParamsDto): Promise<BlockExecutionResultDto> {
  switch (args.block.type) {
    case "manual":
      return await executeManualBlock(args);
    case "doNothing":
      return { output: null, toBlockIds: args.block.toBlocks.map((f) => f.toBlockId) };
    case "log":
      return await executeLogBlock(args);
    case "httpRequest":
      return await executeHttpRequestBlock(args);
    case "if":
      return await executeIfBlock(args);
    case "alertUser":
      return await executeAlertUserBlock(args);
    default:
      throw new Error("Block type not implemented: " + args.block.type);
  }
}

async function executeManualBlock({ block, workflowContext }: BlockExecutionParamsDto): Promise<BlockExecutionResultDto> {
  if (block.input.validation) {
    const error = WorkflowsValidationService.validate(workflowContext["$params"], JSON.parse(block.input.validation));
    if (error) {
      return { output: null, error, throwsError: true, toBlockIds: [] };
    }
    block.input.validation = undefined;
  }
  return {
    output: null,
    toBlockIds: block.toBlocks.map((f) => f.toBlockId),
  };
}

async function executeLogBlock({ block, workflowContext }: BlockExecutionParamsDto): Promise<BlockExecutionResultDto> {
  let message = parseVariable(block.input.message, workflowContext);
  // eslint-disable-next-line no-console
  console.log(`[${block.variableName}] ${message}`);
  return {
    output: {
      message,
    },
    toBlockIds: block.toBlocks.map((f) => f.toBlockId),
  };
}

async function executeHttpRequestBlock({ block, workflowContext }: BlockExecutionParamsDto): Promise<BlockExecutionResultDto> {
  let result: BlockExecutionResultDto = {
    output: {
      statusCode: 0,
      body: null,
      error: null,
    },
    error: null,
    toBlockIds: block.toBlocks.map((f) => f.toBlockId),
  };
  const config = {
    url: parseVariable(block.input.url, workflowContext),
    method: parseVariable(block.input.method, workflowContext),
    body: parseVariable(block.input.body, workflowContext),
    headers: parseVariable(block.input.headers, workflowContext),
    throwsError: block.input.throwsError,
  };
  if (!config.url) {
    throw new Error("URL is required");
  }
  if (!config.method) {
    throw new Error("Method is required");
  }
  try {
    const response = await fetch(config.url, {
      method: config.method,
      body: config.body,
      headers: config.headers ? JSON.parse(config.headers) : undefined,
    });
    result.output.statusCode = response.status;
    result.output.body = await response.json();
    if (result.output.statusCode >= 400) {
      result.output.error = response.statusText;
    }
  } catch (e: any) {
    let error = e.message;
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    result.error = error;
    result.output.error = error;
    result.throwsError = config.throwsError;
  }

  return result;
}

async function executeIfBlock({ block, workflowContext }: BlockExecutionParamsDto): Promise<BlockExecutionResultDto> {
  const trueBlockId = block.toBlocks.find((f) => f.condition === "true")?.toBlockId;
  const falseBlockId = block.toBlocks.find((f) => f.condition === "false")?.toBlockId;
  if (!trueBlockId) {
    throw new Error("Missing true block");
  }
  if (!falseBlockId) {
    throw new Error("Missing false block");
  }
  if (block.conditionGroups.length !== 1) {
    throw new Error("If block must have exactly one condition group");
  }
  const result = WorkflowsConditionsService.validateGroups({ conditionGroup: block.conditionGroups[0], workflowContext });
  return {
    output: {
      condition: result,
      expression: block.conditionGroups[0].conditions.map((f) => WorkflowConditionUtils.getConditionString(f)).join(` ${block.conditionGroups[0].type} `),
    },
    toBlockIds: result ? [trueBlockId] : [falseBlockId],
  };
}

async function executeAlertUserBlock({ block, workflowContext }: BlockExecutionParamsDto): Promise<BlockExecutionResultDto> {
  let message = parseVariable(block.input.message, workflowContext);
  // eslint-disable-next-line no-console
  console.log(`[${block.variableName}] ${message}`);
  return {
    output: {
      type: block.input.type ?? "success",
      message,
    },
    toBlockIds: block.toBlocks.map((f) => f.toBlockId),
  };
}

export default {
  execute,
};
