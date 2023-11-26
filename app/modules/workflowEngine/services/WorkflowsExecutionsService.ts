import { db } from "~/utils/db.server";
import { updateWorkflowExecution } from "../db/workflowExecutions.db.server";
import { WorkflowExecutionDto } from "../dtos/WorkflowExecutionDto";
import WorkflowExecutionUtils from "../helpers/WorkflowExecutionUtils";
import WorkflowsService from "./WorkflowsService";
import WorkflowBlockService from "./blocks/WorkflowBlockService";
import WorkflowVariablesAndCredentialsService from "./WorkflowVariablesAndCredentialsService";
import { WorkflowBlockDto } from "../dtos/WorkflowBlockDto";
import { WorkflowStatus } from "../dtos/WorkflowStatus";

async function execute(
  workflowId: string,
  {
    input,
    session,
    execution,
    fromBlockId,
  }: {
    input: { [key: string]: any } | null;
    session: { tenantId: string | null; userId: string | null };
    execution?: { id: string } | null;
    fromBlockId?: string | null;
  }
): Promise<WorkflowExecutionDto> {
  const workflow = await WorkflowsService.get(workflowId, session);
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  if (!execution) {
    execution = await db.workflowExecution.create({
      data: {
        tenantId: session.tenantId,
        workflowId: workflow.id,
        type: "manual",
        input: JSON.stringify(input),
        status: "running",
        output: null,
        duration: null,
        endedAt: null,
        error: null,
      },
    });
  }
  let firstBlock: WorkflowBlockDto | undefined = undefined;
  if (fromBlockId) {
    firstBlock = workflow.blocks.find((f) => f.id === fromBlockId);
    if (!firstBlock) {
      throw new Error("Workflow has no block with id " + fromBlockId);
    }
  } else {
    firstBlock = workflow.blocks.find((f) => f.isTrigger);
    if (!firstBlock) {
      throw new Error("Workflow has no trigger block");
    }
  }
  const startTime = performance.now();
  let error: string | null = null;
  let result: {
    status: WorkflowStatus;
    workflowContext: { [key: string]: any };
  } = { status: "running", workflowContext: {} };
  let tenant = session.tenantId
    ? await db.tenant.findFirstOrThrow({ where: { OR: [{ slug: session.tenantId }, { id: session.tenantId }] } }).catch(() => null)
    : null;
  let user = session.userId ? await db.user.findUnique({ where: { id: session.userId } }) : null;
  try {
    result = await WorkflowBlockService.execute({
      workflowContext: {
        $params: input,
        $session: {
          tenant: tenant ? { id: tenant.id, name: tenant.name } : null,
          user: user ? { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } : null,
        },
        $vars: await WorkflowVariablesAndCredentialsService.getVariablesContext({ tenantId: session.tenantId }),
      },
      workflowExecutionId: execution.id,
      workflow,
      block: firstBlock,
      fromBlock: null,
      session,
    });
  } catch (e: any) {
    error = e.message;
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(e.stack);
    }
  }
  const endTime = performance.now();
  const duration = endTime - startTime;

  delete result.workflowContext.$credentials;
  const updatedExecution = await updateWorkflowExecution(execution.id, {
    status: error ? "error" : result.status,
    output: JSON.stringify(result.workflowContext),
    duration: Math.round(duration),
    error,
  });

  return WorkflowExecutionUtils.rowToDto(updatedExecution);
}

export default {
  execute,
};
