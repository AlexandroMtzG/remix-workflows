import { db } from "~/utils/db.server";
import { WorkflowTemplateDto, WorkflowsTemplateDto } from "../dtos/WorkflowsTemplateDto";
import { WorkflowBlockTypes } from "../dtos/WorkflowBlockTypes";
import WorkflowsService from "./WorkflowsService";
import { WorkflowDto } from "../dtos/WorkflowDto";
import { WorkflowVariable } from "@prisma/client";
import { createWorkflowVariable } from "../db/workflowVariable.db.server";
import { validateIsReadOnly } from "../utils/WorkflowUtils";

async function importWorkflows(template: WorkflowsTemplateDto, session: { tenantId: string | null }) {
  validateIsReadOnly();
  const allWorkflowVariables = await db.workflowVariable.findMany({
    where: { tenantId: session.tenantId },
  });
  const requiredEntities: string[] = [];
  template.workflows.forEach((worklow) => {
    const entityBlocks = worklow.blocks.filter((f) => f.type.startsWith("row"));
    entityBlocks.forEach((entityBlock) => {
      if (entityBlock.input?.entity && !requiredEntities.includes(entityBlock.input.entity)) {
        requiredEntities.push(entityBlock.input.entity);
      }
    });
  });
  if (template.variables) {
    await Promise.all(
      template.variables.map(async (variable) => {
        let existing = allWorkflowVariables.find((f) => f.name === variable.name);
        if (existing) {
          return;
        }
        await createWorkflowVariable({
          tenantId: session.tenantId,
          name: variable.name,
          value: variable.value,
        });
      })
    );
  }
  const workflows = await Promise.all(
    template.workflows.map(async (workflow) => {
      return await importWorkflow(workflow, session);
    })
  );
  return workflows;
}

async function importWorkflow(template: WorkflowsTemplateDto["workflows"][0], session: { tenantId: string | null }) {
  const workflow = await db.workflow.create({
    data: {
      tenantId: session.tenantId,
      name: template.name,
      description: template.description || "",
      status: "draft",
    },
  });
  const blocksIdMap: { [key: string]: string } = {};
  for (const block of template.blocks) {
    const workflowBlock = WorkflowBlockTypes.find((f) => f.value === block.type);
    if (!workflowBlock) {
      await db.workflow.delete({ where: { id: workflow.id } });
      throw new Error("Invalid workflow block type: " + block.type);
    }
    const newBlock = await db.workflowBlock.create({
      data: {
        workflowId: workflow.id,
        type: block.type,
        description: block.description || "",
        isTrigger: workflowBlock.type === "trigger",
        isBlock: workflowBlock.type === "action",
        // positionX: 0,
        // positionY: 0,
        input: JSON.stringify(block.input || {}),
      },
    });
    blocksIdMap[block.id] = newBlock.id;
    if (block.conditionGroups) {
      let idx = 0;
      for (const { type, conditions } of block.conditionGroups) {
        const conditionGroup = await db.workflowBlockConditionGroup.create({
          data: {
            workflowBlockId: newBlock.id,
            index: idx,
            type: type || ("AND" as "AND" | "OR"),
          },
        });
        let idxCondition = 0;
        for (const { variable, operator, value } of conditions) {
          await db.workflowBlockCondition.create({
            data: {
              workflowBlockConditionGroupId: conditionGroup.id,
              index: idxCondition,
              variable,
              operator,
              value,
            },
          });
          idxCondition++;
        }

        idx++;
      }
    }
  }

  await Promise.all(
    template.toBlocks.map(async (toBlock) => {
      if (!blocksIdMap[toBlock.toBlockId]) {
        await db.workflow.delete({ where: { id: workflow.id } });
        throw new Error(`Block ${toBlock.toBlockId} not found`);
      }
      if (!blocksIdMap[toBlock.fromBlockId]) {
        await db.workflow.delete({ where: { id: workflow.id } });
        throw new Error(`Block ${toBlock.fromBlockId} not found`);
      }
      await db.workflowBlockToBlock.create({
        data: {
          fromBlockId: blocksIdMap[toBlock.fromBlockId],
          toBlockId: blocksIdMap[toBlock.toBlockId],
          condition: toBlock.condition || null,
        },
      });
    })
  );

  for (const inputExample of template.inputExamples) {
    await db.workflowInputExample.create({
      data: {
        workflowId: workflow.id,
        title: inputExample.title,
        input: JSON.stringify(inputExample.input),
      },
    });
  }

  return (await WorkflowsService.get(workflow.id, session))!;
}

async function getTemplate(items: WorkflowDto[], variables: WorkflowVariable[]): Promise<WorkflowsTemplateDto> {
  const workflows: WorkflowTemplateDto[] = [];
  items.forEach((workflow) => {
    let toBlocks: { fromBlockId: string; toBlockId: string; condition?: string }[] = [];
    const item: WorkflowTemplateDto = {
      name: workflow.name,
      description: workflow.description || undefined,
      blocks: workflow.blocks.map((block) => {
        return {
          id: block.variableName,
          // index: block.index,
          type: block.type,
          description: block.description || undefined,
          input: block.input,
          conditionGroups: block.conditionGroups?.map((conditionGroup) => ({
            type: conditionGroup.type,
            conditions: conditionGroup.conditions.map((condition) => ({
              variable: condition.variable,
              operator: condition.operator,
              value: condition.value,
            })),
          })),
        };
      }),
      toBlocks,
      inputExamples: workflow.inputExamples.map((inputExample) => ({
        title: inputExample.title,
        input: inputExample.input,
      })),
    };
    workflow.blocks.forEach((block) => {
      block.toBlocks.forEach(({ id, toBlockId, condition }) => {
        const toBlock = workflow.blocks.find((f) => f.id === toBlockId);
        if (!toBlock) {
          throw new Error(`Block ${id} not found`);
        }
        toBlocks.push({
          fromBlockId: block.variableName,
          toBlockId: toBlock.variableName,
          condition: condition || undefined,
        });
      });
    });
    item.toBlocks = toBlocks;
    workflows.push(item);
  });
  return {
    title: "Workflows",
    workflows,
    variables: variables.map((variable) => ({ name: variable.name, value: variable.value })),
  };
}

export default {
  importWorkflows,
  getTemplate,
};
