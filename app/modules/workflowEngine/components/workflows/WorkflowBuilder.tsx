import ReactFlow, {
  Controls,
  useReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Connection,
  ConnectionLineType,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { WorkflowDto } from "../../dtos/WorkflowDto";
import WorkflowContext from "../../context/WorkflowContext";
import { useCallback, useEffect, useMemo } from "react";
import SetTriggerNode from "../nodes/triggers/SetTriggerNode";
import { WorkflowBlockDto } from "../../dtos/WorkflowBlockDto";
import BlockEditorNode from "../nodes/BlockEditorNode";
import CustomEdge from "../edges/CustomEdge";
import WorkflowLayoutUtils from "../../helpers/WorkflowLayoutUtils";
import { WorkflowExecutionDto } from "../../dtos/WorkflowExecutionDto";
import BlockExecutionNode from "../nodes/BlockExecutionNode";

interface Props {
  workflow: WorkflowDto;
  selectedBlock: WorkflowBlockDto | null;
  workflowExecution: WorkflowExecutionDto | null;
  onSelectedBlock: (node: WorkflowBlockDto | null) => void;
  onConnectBlocks?: (data: { fromBlockId: string; toBlockId: string; condition: string | null }) => void;
  onDeleteConnection?: (edgeId: string) => void;
  onDeleteBlock?: (nodeId: string) => void;
  readOnly?: boolean;
}
export default function WorkflowBuilder(props: Props) {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderFlow {...props} />
    </ReactFlowProvider>
  );
}

function WorkflowBuilderFlow({
  workflow,
  selectedBlock,
  workflowExecution,
  onSelectedBlock,
  onConnectBlocks,
  onDeleteConnection,
  onDeleteBlock,
  readOnly,
}: Props) {
  const reactFlowInstance = useReactFlow();

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  const nodeTypes = useMemo(
    () => ({
      blockEditorNode: BlockEditorNode,
      blockExecutionNode: BlockExecutionNode,
      setTriggerNode: SetTriggerNode,
    }),
    []
  );

  const edgeTypes = useMemo(() => {
    return {
      customEdge: CustomEdge,
    };
  }, []);

  useEffect(() => {
    const { nodes: initialNodes, edges: initialEdges } = WorkflowLayoutUtils.workflowToReactFlow({
      workflow,
      workflowExecution,
      workflowBlocks: workflow.blocks,
    });
    const { nodes: layoutedNodes, edges: layoutedEdges } = WorkflowLayoutUtils.getLayoutedElements({
      readOnly: readOnly || !!workflowExecution,
      nodes: initialNodes,
      edges: initialEdges,
      direction: "TB",
    });
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [readOnly, setEdges, setNodes, workflow, workflowExecution]);

  useEffect(() => {
    setTimeout(() => {
      reactFlowInstance?.fitView();
    }, 100);
  }, [reactFlowInstance, nodes, edges, workflow]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!onConnectBlocks) {
        return;
      }
      const fromBlock = workflow.blocks.find((x) => x.id === params.source);
      const toBlock = workflow.blocks.find((x) => x.id === params.target);
      if (!fromBlock || !toBlock) {
        return;
      }
      if (fromBlock.id === toBlock.id) {
        return;
      }
      if (fromBlock.toBlocks.find((x) => x.toBlockId === toBlock.id)) {
        // already connected
        return;
      }
      if (toBlock.toBlocks.find((x) => x.toBlockId === fromBlock.id)) {
        // already connected
        return;
      }
      let condition: string | null = null;
      if (fromBlock.type === "if") {
        const hasTrue = fromBlock.toBlocks.find((x) => x.condition === "true");
        const hasFalse = fromBlock.toBlocks.find((x) => x.condition === "false");
        if (!hasTrue) {
          condition = "true";
        } else if (!hasFalse) {
          condition = "false";
        } else {
          return;
        }
      }
      onConnectBlocks({
        fromBlockId: params.source!,
        toBlockId: params.target!,
        condition,
      });

      setTimeout(() => {
        reactFlowInstance?.fitView();
      }, 1000);
    },
    [onConnectBlocks, reactFlowInstance, workflow.blocks]
  );

  const onEdgeDelete = useCallback(
    (edgeId: string) => {
      if (!onDeleteConnection || workflowExecution) {
        return;
      }
      onDeleteConnection(edgeId);
    },
    [onDeleteConnection, workflowExecution]
  );

  const onNodeDelete = useCallback(
    (nodeId: string) => {
      if (!onDeleteBlock || workflowExecution) {
        return;
      }
      onDeleteBlock(nodeId);
    },
    [onDeleteBlock, workflowExecution]
  );

  const isNodeSelected = useCallback(
    (nodeId: string) => {
      return selectedBlock?.id === nodeId;
    },
    [selectedBlock]
  );

  const isReadOnly = useMemo(() => {
    return readOnly || !!workflowExecution;
  }, [readOnly, workflowExecution]);

  return (
    <WorkflowContext.Provider value={{ isReadOnly, onEdgeDelete, onNodeDelete, isNodeSelected }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.Straight}
        onNodeClick={(event, node) => {
          const block = workflow.blocks.find((x) => x.id === node.id);
          if (block) {
            onSelectedBlock(block);
          }
        }}
        onPaneClick={() => onSelectedBlock(null)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.5} // 50%
        maxZoom={2} // 200%
        fitView
      >
        <Background color="#94a3b8" variant={BackgroundVariant.Dots} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </WorkflowContext.Provider>
  );
}
