import { Node, Edge, Position, MarkerType } from "reactflow";
import dagre from "dagre";
import { WorkflowDto } from "../dtos/WorkflowDto";
import { WorkflowBlockDto } from "../dtos/WorkflowBlockDto";
import WorkflowUtils from "./WorkflowUtils";
import { WorkflowExecutionDto } from "../dtos/WorkflowExecutionDto";
import { WorkflowBlockExecutionDto } from "../dtos/WorkflowBlockExecutionDto";
const nodeWidth = 250;
const nodeHeight = 80;

const getLayoutedElements = ({
  nodes,
  edges,
  direction = "LR",
  readOnly = false,
}: {
  nodes: Node[];
  edges: Edge[];
  direction?: "LR" | "TB" | "RL" | "BT";
  readOnly?: boolean;
}) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    node.draggable = !readOnly;

    return node;
  });

  return { nodes, edges };
};

const workflowToReactFlow = ({
  workflow,
  workflowBlocks,
  workflowExecution,
}: {
  workflow: WorkflowDto;
  workflowBlocks: WorkflowBlockDto[];
  workflowExecution: WorkflowExecutionDto | null;
}) => {
  let nodes: Node[] = workflowBlocks.map((block) => {
    let workflowBlockExecution: WorkflowBlockExecutionDto | null = null;
    if (workflowExecution) {
      workflowBlockExecution = workflowExecution.blockRuns.find((f) => f.workflowBlockId === block.id) || null;
    }
    return {
      id: block.id,
      type: workflowExecution ? "blockExecutionNode" : "blockEditorNode",
      data: { workflow, block, workflowExecution, workflowBlockExecution },
      position: { x: 0, y: 0 },
      draggable: false,
    };
  });

  let edges = workflowBlocks.flatMap((block) =>
    block.toBlocks
      .sort((a, b) => a.condition?.localeCompare(b.condition || "") || 0)
      .map((toBlock) => {
        const fromBlockId = block.id;
        const toBlockId = toBlock.toBlockId;
        const isExecuted = workflowExecution?.blockRuns.find((f) => f.fromWorkflowBlockId === fromBlockId && f.workflowBlockId === toBlockId);
        const edge: Edge = {
          id: toBlock.id,
          source: block.id,
          target: toBlock.toBlockId,
          type: "customEdge",
          animated: true,
          deletable: false,
          updatable: !workflowExecution ? "source" : false,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
          },
          style: {
            strokeWidth: 1.5,
            stroke: isExecuted ? "#14b8a6" : "#9ca3af",
          },
          data: {
            condition: toBlock.condition,
            isExecuted,
          },
        };
        return edge;
      })
  );

  const hasTrigger = WorkflowUtils.hasTriggerNode(workflow);
  if (!hasTrigger) {
    nodes = [
      {
        type: "setTriggerNode",
        id: "1",
        data: { label: "Set a trigger in the sidebar" },
        position: { x: 0, y: 0 },
      },
    ];
  }
  return {
    nodes,
    edges,
  };
};

export default {
  getLayoutedElements,
  workflowToReactFlow,
};
