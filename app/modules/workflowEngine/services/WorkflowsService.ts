import { db } from "~/utils/db.server";
import { createWorkflowBlock, updateWorkflowBlock } from "../db/workflowBlocks.db.server";
import { WorkflowWithDetails, createWorkflow, deleteWorkflow, getAllWorkflows, getWorkflowById, updateWorkflow } from "../db/workflows.db.server";
import { WorkflowDto } from "../dtos/WorkflowDto";
import { WorkflowBlockInput, WorkflowBlockTypes } from "../dtos/WorkflowBlockTypes";
import { WorkflowBlockDto } from "../dtos/WorkflowBlockDto";
import WorkflowUtils from "../helpers/WorkflowUtils";
import { WorkflowConditionsGroupDto } from "../dtos/WorkflowConditionDtos";
import WorkflowExecutionUtils from "../helpers/WorkflowExecutionUtils";
import { getWorkflowExecution, getWorkflowExecutions } from "../db/workflowExecutions.db.server";
import { getAllWorkflowVariables } from "../db/workflowVariable.db.server";
import WorkflowBlockUtils from "../helpers/WorkflowBlockUtils";
import { validateIsReadOnly } from "../utils/WorkflowUtils";

async function create(session: { tenantId: string | null }) {
  const name = await getNextUntiledWorkflowName({ tenantId: session.tenantId });
  return await createWorkflow({
    tenantId: session.tenantId,
    name,
    description: "",
  });
}

async function get(id: string, { tenantId }: { tenantId: string | null }): Promise<WorkflowDto | null> {
  const item = await getWorkflowById({ id, tenantId });
  if (!item) {
    return null;
  }
  const $variables = await getAllWorkflowVariables({ tenantId });
  return await workflowToDto(item, {
    $variables: $variables.map((f) => f.name),
  });
}

async function getAll({ tenantId }: { tenantId: string | null }): Promise<WorkflowDto[]> {
  const items = await getAllWorkflows({ tenantId });
  return await Promise.all(items.map((item) => workflowToDto(item)));
}

async function getAllActive({ tenantId }: { tenantId: string | null }): Promise<WorkflowDto[]> {
  const items = await getAllWorkflows({ tenantId, status: "live" });
  return await Promise.all(items.map((item) => workflowToDto(item)));
}

async function workflowToDto(
  item: WorkflowWithDetails,
  global?: {
    $variables: string[];
  }
) {
  const workflow: WorkflowDto = {
    id: item.id,
    tenantId: item.tenantId,
    name: item.name,
    description: item.description,
    status: item.status as WorkflowDto["status"],
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    blocks: await Promise.all(
      item.blocks.map(async (block, index) => {
        const workflowBlock = WorkflowBlockUtils.rowToDto(block, index);
        if (workflowBlock.type === "if") {
          if (workflowBlock.conditionGroups.length === 0) {
            await addConditionGroup(workflowBlock, [
              {
                index: 0,
                type: "AND",
                conditions: [],
              },
            ]);
          }
        }
        return workflowBlock;
      })
    ),
    inputExamples: item.inputExamples.map((inputExample) => {
      let input: { [key: string]: any } = {};
      try {
        input = inputExample.input ? JSON.parse(inputExample.input) : null;
      } catch {}
      return {
        id: inputExample.id,
        title: inputExample.title,
        input,
        createdAt: inputExample.createdAt,
      };
    }),
    _count: item._count,
    readOnly: process.env.READ_ONLY ? true : false,
  };
  workflow.blocks.forEach((block) => {
    const { variableName, index } = WorkflowUtils.getVariableName({ workflow, currentBlock: block });
    block.variableName = variableName;
    block.index = index;
  });
  workflow.blocks = workflow.blocks.sort((a, b) => a.index - b.index);
  workflow.inputExamples = workflow.inputExamples.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return a.createdAt > b.createdAt ? 1 : -1;
    }
    return 0;
  });
  workflow.$variables = global?.$variables ?? [];
  return workflow;
}

async function addConditionGroup(workflowBlock: WorkflowBlockDto, data: WorkflowConditionsGroupDto[]) {
  validateIsReadOnly();
  return await Promise.all(
    data.map(async (conditionGroup) => {
      const conditions = conditionGroup.conditions.map((condition) => {
        return {
          index: condition.index,
          variable: condition.variable,
          operator: condition.operator,
          value: condition.value,
        };
      });
      await db.workflowBlockConditionGroup.create({
        data: {
          workflowBlockId: workflowBlock.id,
          index: conditionGroup.index,
          type: conditionGroup.type,
          conditions: {
            create: conditions,
          },
        },
      });
      workflowBlock.conditionGroups.push(conditionGroup);
      return conditionGroup;
    })
  );
}

async function update(
  id: string,
  workflow: {
    name?: string;
    description?: string;
    status?: "draft" | "live" | "archived";
    blocks?: WorkflowBlockDto[];
  },
  session: { tenantId: string | null }
): Promise<WorkflowDto | null> {
  const item = await get(id, session);
  if (!item) {
    return null;
  }
  if (item.tenantId !== session.tenantId) {
    throw new Error("You cannot edit this workflow");
  }
  if (workflow.name !== undefined && workflow.name.trim() === "") {
    workflow.name = await getNextUntiledWorkflowName({ tenantId: session.tenantId });
  }

  await updateWorkflow(id, {
    name: workflow.name,
    description: workflow.description,
    status: workflow.status,
  });

  return get(id, session);
}

async function getNextUntiledWorkflowName({ tenantId }: { tenantId: string | null }) {
  const allWorkflowNames = await db.workflow.findMany({
    where: {
      tenantId,
    },
    select: { name: true },
  });

  let workflowName = "Untitled workflow 1";
  const existingWorkflowNames = allWorkflowNames.map((f) => f.name);
  if (!existingWorkflowNames.includes(workflowName)) {
    return workflowName;
  }
  let i = 2;
  while (existingWorkflowNames.includes(workflowName)) {
    workflowName = `Untitled workflow ${i}`;
    i++;
    if (i > 1000) {
      throw new Error("Too many untitled workflows");
    }
  }
  return workflowName;
}

async function del(id: string, session: { tenantId: string | null }) {
  const item = await get(id, session);
  if (!item) {
    throw new Error("Workflow not found");
  }
  if (item.tenantId !== session.tenantId) {
    throw new Error("You cannot delete this workflow");
  }

  return await deleteWorkflow(id);
}

async function updateBlock(id: string, block: WorkflowBlockDto) {
  return await updateWorkflowBlock(id, {
    type: block.type,
    input: JSON.stringify(block.input),
    description: block.description,
    isTrigger: block.isTrigger,
    isBlock: block.isBlock,
    // positionX: block.position.x,
    // positionY: block.position.y,
  });
}

async function addBlock({
  workflow,
  type,
  fromBlockId,
  condition,
}: {
  workflow: WorkflowDto;
  type: string;
  fromBlockId: string | undefined;
  condition: string | null;
}) {
  validateIsReadOnly();
  const workflowBlock = WorkflowBlockTypes.find((f) => f.value === type);
  if (!workflowBlock) {
    throw new Error("Invalid workflow block type: " + type);
  }
  let inputData: { [key: string]: any } = {};
  workflowBlock.inputs.forEach((input) => {
    let blockInput = input as WorkflowBlockInput;
    if (blockInput.defaultValue !== undefined) {
      inputData[blockInput.name] = blockInput.defaultValue;
    }
  });
  const toBlock = await createWorkflowBlock({
    workflowId: workflow.id,
    type,
    input: JSON.stringify(inputData),
    description: "",
    isTrigger: workflowBlock.type === "trigger",
    isBlock: workflowBlock.type === "action",
    // positionX: 0,
    // positionY: 0,
  });

  if (fromBlockId) {
    await db.workflowBlockToBlock.create({
      data: {
        fromBlockId,
        toBlockId: toBlock.id,
        condition,
      },
    });
  }

  if (workflowBlock.type === "trigger") {
    const blocksWithoutParents = WorkflowUtils.getBlocksWithoutCallers(workflow);
    if (blocksWithoutParents.length === 1) {
      await db.workflowBlockToBlock.create({
        data: {
          fromBlockId: toBlock.id,
          toBlockId: blocksWithoutParents[0].id,
          condition: null,
        },
      });
    }
  }

  return toBlock;
}

async function deleteBlock(id: string) {
  validateIsReadOnly();
  return await db.workflowBlock.delete({
    where: { id },
  });
}

async function connectBlocks({ fromBlockId, toBlockId, condition }: { fromBlockId: string; toBlockId: string; condition: string | null }) {
  validateIsReadOnly();
  return await db.workflowBlockToBlock.create({
    data: {
      fromBlockId,
      toBlockId,
      condition,
    },
  });
}

async function deleteConnection(params: { fromBlockId: string; toBlockId: string } | { id: string }) {
  validateIsReadOnly();
  if ("id" in params) {
    return await db.workflowBlockToBlock.delete({
      where: { id: params.id },
    });
  } else {
    return await db.workflowBlockToBlock.deleteMany({
      where: {
        fromBlockId: params.fromBlockId,
        toBlockId: params.toBlockId,
      },
    });
  }
}

async function updateConditionsGroups(block: WorkflowBlockDto, conditionGroups: WorkflowConditionsGroupDto[]) {
  validateIsReadOnly();
  await db.workflowBlockConditionGroup.deleteMany({
    where: {
      workflowBlockId: block.id,
    },
  });
  await Promise.all(
    conditionGroups
      .sort((a, b) => a.index - b.index)
      .map(async (group, groupIndex) => {
        const conditions = group.conditions
          .sort((a, b) => a.index - b.index)
          .map((condition, conditionIndex) => {
            return {
              index: conditionIndex,
              variable: condition.variable,
              operator: condition.operator,
              value: condition.value,
            };
          });
        await db.workflowBlockConditionGroup.create({
          data: {
            workflowBlockId: block.id,
            index: groupIndex,
            type: group.type,
            conditions: {
              create: conditions,
            },
          },
        });
      })
  );
}

async function getExecutions(item: WorkflowDto, { tenantId }: { tenantId: string | null }) {
  const items = await getWorkflowExecutions({ workflowId: item.id }, { tenantId });
  return items.map((f) => WorkflowExecutionUtils.rowToDto(f));
}

async function getExecution(id: string, { tenantId }: { tenantId: string | null }) {
  const item = await getWorkflowExecution(id, { tenantId });
  if (!item) {
    return null;
  }
  return WorkflowExecutionUtils.rowToDto(item);
}

async function createInputExample({ workflowId, title, input }: { workflowId: string; title: string; input: string }) {
  validateIsReadOnly();
  return await db.workflowInputExample.create({
    data: {
      workflowId,
      title,
      input,
    },
  });
}
async function updateInputExample(id: string, { title, input }: { title: string; input: string }) {
  validateIsReadOnly();
  return await db.workflowInputExample.update({
    where: { id },
    data: {
      title,
      input,
    },
  });
}
async function deleteInputExample(id: string) {
  validateIsReadOnly();
  return await db.workflowInputExample.delete({
    where: { id },
  });
}
export default {
  create,
  get,
  getAll,
  getAllActive,
  update,
  del,
  updateBlock,
  addBlock,
  deleteBlock,
  connectBlocks,
  deleteConnection,
  updateConditionsGroups,
  getExecutions,
  getExecution,
  createInputExample,
  updateInputExample,
  deleteInputExample,
};
