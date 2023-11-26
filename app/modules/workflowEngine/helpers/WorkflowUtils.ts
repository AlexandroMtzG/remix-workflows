import { Colors } from "~/application/enums/shared/Colors";
import { WorkflowDto } from "../dtos/WorkflowDto";
import { WorkflowBlockDto } from "../dtos/WorkflowBlockDto";
import WorkflowBlockUtils from "./WorkflowBlockUtils";
import { WorkflowBlockTypes } from "../dtos/WorkflowBlockTypes";

function canRun(workflow: WorkflowDto) {
  return true;
  // return workflow.status === "live";
}

function canRunManually(workflow: WorkflowDto) {
  return workflow.blocks.find((f) => f.type === "manual");
}

function getStatusColor(workflow: WorkflowDto): Colors {
  switch (workflow.status) {
    case "draft":
      return Colors.SLATE;
    case "live":
      return Colors.GREEN;
    case "archived":
      return Colors.GRAY;
  }
}

function getStatusTitle(workflow: WorkflowDto): string {
  switch (workflow.status) {
    case "draft":
      return "Draft";
    case "live":
      return "Live";
    case "archived":
      return "Archived";
  }
}

function hasTriggerNode(workflow: WorkflowDto) {
  return workflow.blocks.find((f) => f.isTrigger);
}

function getBlocksErrors(workflow: WorkflowDto): {
  block: WorkflowBlockDto;
  errors: string[];
}[] {
  const blockErrors: { block: WorkflowBlockDto; errors: string[] }[] = [];

  workflow.blocks.forEach((block) => {
    const errors = WorkflowBlockUtils.getBlockErrors({ workflow, block });
    if (errors.length > 0) {
      blockErrors.push({ block, errors });
    }
  });

  return blockErrors;
}

function getBlocksWithoutCallers(workflow: WorkflowDto): WorkflowBlockDto[] {
  const blocksWithoutCallers: WorkflowBlockDto[] = [];

  workflow.blocks.forEach((block) => {
    if (block.isBlock) {
      const nodesConnectingToThisStep = workflow.blocks.filter((f) => {
        return f.toBlocks.find((t) => t.toBlockId === block.id);
      });
      if (nodesConnectingToThisStep.length === 0) {
        blocksWithoutCallers.push(block);
      }
    }
  });

  return blocksWithoutCallers;
}

function isReady(workflow: WorkflowDto) {
  const errors = getBlocksErrors(workflow);
  const blocksWithoutCallers = getBlocksWithoutCallers(workflow);
  const hasTrigger = hasTriggerNode(workflow);

  return errors.length === 0 && blocksWithoutCallers.length === 0 && hasTrigger;
}

function getVariables({ workflow, currentBlock, onlyInBlock }: { workflow: WorkflowDto; currentBlock: WorkflowBlockDto; onlyInBlock?: boolean }) {
  const triggerNode = workflow.blocks.find((f) => f.isTrigger);
  if (!triggerNode) return [];
  // const paths = buildPaths(workflow, triggerNode.id, [], {});
  // const currentPath = paths[currentBlock.id] || [];

  const variables: { group: string; name: string; label: string }[] = [];

  if (!onlyInBlock) {
    variables.push(
      { group: "Params", name: "{{$params.}}", label: "Params value" },
      { group: "Session", name: "{{$session.tenant.id}}", label: "Tenant ID" },
      { group: "Session", name: "{{$session.user.email}}", label: "User Email" }
    );
  }

  workflow.blocks.forEach((block, idxBlock) => {
    // if (!currentPath.includes(block.id)) return;
    if (onlyInBlock && block.id !== currentBlock.id) return;

    const workflowBlock = WorkflowBlockTypes.find((f) => f.value === block.type);
    if (!workflowBlock) return;

    workflowBlock.outputs.forEach((output) => {
      const variableName = `{{${block.variableName}.${output.name}}}`;
      let variableLabel = `${output.label}`;
      if (onlyInBlock) {
        variableLabel = output.label;
      }
      variables.push({
        group: `${workflowBlock.name} ${idxBlock + 1}`,
        name: variableName,
        label: variableLabel,
      });
    });
  });

  return variables;
}

function getVariableName({ workflow, currentBlock }: { workflow: WorkflowDto; currentBlock: { id: string; type: string } }) {
  // Function to recursively build a list of block IDs in execution order
  function buildExecutionOrder(blockId: string, order: string[] = [], visited = new Set()) {
    if (visited.has(blockId)) return order;
    visited.add(blockId);

    const block = workflow.blocks.find((b) => b.id === blockId);
    if (!block) return order;

    order.push(blockId);

    const orders = ["true", "false", "default", "case", "loopNext", "loopEnd"];
    block.toBlocks
      .sort((a, b) => {
        if (!a.condition) {
          return -1;
        }
        if (!b.condition) {
          return 1;
        }
        const aOrder = orders.findIndex((f) => a.condition?.startsWith(f));
        const bOrder = orders.findIndex((f) => b.condition?.startsWith(f));
        return aOrder - bOrder;
      })
      .forEach((toBlock) => {
        buildExecutionOrder(toBlock.toBlockId, order, visited);
      });

    return order;
  }

  // Get execution order starting from the first block (assuming it's a trigger)
  const executionOrder = buildExecutionOrder(workflow.blocks.find((b) => b.isTrigger)?.id || "");

  // Count occurrences of block types in execution order
  const blockTypeCounts: { [key: string]: number } = {};
  executionOrder.forEach((blockId) => {
    const block = workflow.blocks.find((b) => b.id === blockId);
    if (block) {
      blockTypeCounts[block.type] = (blockTypeCounts[block.type] || 0) + 1;
    }
  });

  // Determine the index of the current block in its type group
  const currentBlockIndex = executionOrder.filter((id) => workflow.blocks.find((b) => b.id === id)?.type === currentBlock.type).indexOf(currentBlock.id) + 1;

  // Append index if there are multiple blocks of the same type
  return {
    variableName: blockTypeCounts[currentBlock.type] > 1 ? `${currentBlock.type}${currentBlockIndex}` : currentBlock.type,
    index: currentBlockIndex,
  };
}

function getBlockTypeName(workflowBlock: { type: string }) {
  const workflowBlockType = WorkflowBlockTypes.find((f) => f.value === workflowBlock.type);
  if (!workflowBlockType) return "";
  return `${workflowBlockType.name}`;
}

export default {
  canRun,
  canRunManually,
  getStatusColor,
  getStatusTitle,
  hasTriggerNode,
  getBlocksErrors,
  getBlocksWithoutCallers,
  isReady,
  getVariables,
  getVariableName,
  getBlockTypeName,
};
