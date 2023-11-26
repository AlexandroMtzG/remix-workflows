import { WorkflowDto } from "../dtos/WorkflowDto";
import { WorkflowBlockInput, WorkflowBlockType, WorkflowBlockTypes } from "../dtos/WorkflowBlockTypes";
import { WorkflowBlockDto } from "../dtos/WorkflowBlockDto";
import WorkflowConditionUtils from "./WorkflowConditionUtils";
import { WorkflowBlockWithDetails } from "../db/workflowBlocks.db.server";
import { WorkflowConditionOperator } from "../dtos/WorkflowConditionDtos";

function rowToDto(block: WorkflowBlockWithDetails, index: number = 0) {
  let input: any = {};
  try {
    input = JSON.parse(block.input);
  } catch (e) {}
  const workflowBlock: WorkflowBlockDto = {
    id: block.id,
    index,
    type: block.type as WorkflowBlockType,
    variableName: "",
    description: block.description,
    input,
    isTrigger: block.isTrigger,
    isBlock: block.isBlock,
    toBlocks: block.toBlocks.map((toBlock) => {
      return {
        id: toBlock.id,
        fromBlockId: block.id,
        toBlockId: toBlock.toBlockId,
        condition: toBlock.condition,
      };
    }),
    conditionGroups: block.conditionsGroups
      .sort((a, b) => a.index - b.index)
      .map((group) => {
        return {
          index: group.index,
          type: group.type as "AND" | "OR",
          conditions: group.conditions
            .sort((a, b) => a.index - b.index)
            .map((condition) => {
              return {
                index: condition.index,
                variable: condition.variable,
                operator: condition.operator as WorkflowConditionOperator,
                value: condition.value,
              };
            }),
        };
      }),
  };
  return workflowBlock;
}

function getBlockErrors({ workflow, block }: { workflow: WorkflowDto; block: WorkflowBlockDto }) {
  const errors: string[] = [];

  if (block.isTrigger) {
    if (block.toBlocks.length === 0) {
      errors.push("Add a next block for this trigger");
    }
    // if (!block.description) {
    //   errors.push("Add a description for this trigger");
    // }
  } else if (block.isBlock) {
    const nodesConnectingToThisBlock = workflow.blocks.filter((f) => {
      return f.toBlocks.find((t) => t.toBlockId === block.id);
    });
    if (nodesConnectingToThisBlock.length === 0) {
      errors.push("Nothing is connecting to this block");
    }
    if (block.type === "if") {
      const hasTrue = block.toBlocks.find((f) => f.condition === "true");
      const hasFalse = block.toBlocks.find((f) => f.condition === "false");
      if (!hasTrue) {
        errors.push("Add a next block for true condition");
      }
      if (!hasFalse) {
        errors.push("Add a next block for false condition");
      }
    }
  }

  const workflowBlock = WorkflowBlockTypes.find((f) => f.value === block.type);
  if (!workflowBlock) {
    errors.push("Invalid workflow block type: " + block.type);
  }
  if (workflowBlock?.inputs) {
    workflowBlock.inputs.forEach((input) => {
      const { required } = input as WorkflowBlockInput;
      if (required && !block.input[input.name]) {
        errors.push("Missing required input: " + input.name);
      }
    });
  }

  if (workflowBlock?.value === "if") {
    const conditionGroups = block.conditionGroups;
    if (conditionGroups.length !== 1) {
      errors.push("At least one condition group is required");
    } else {
      if (conditionGroups[0].conditions.length === 0) {
        errors.push("At least one condition is required");
      } else {
        const groupErrors = WorkflowConditionUtils.getConditionsErrors(conditionGroups[0].conditions);
        if (groupErrors.length > 0) {
          errors.push("Invalid conditions: " + groupErrors.flatMap((f) => f.errors).join(", "));
        }
      }
    }
  }

  return errors;
}

export default {
  rowToDto,
  getBlockErrors,
};
