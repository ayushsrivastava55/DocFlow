import React, { useCallback } from 'react';
import ReactFlow, { 
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

const CustomNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-green-500 text-white">
    <Handle type="target" position={Position.Top} className="w-2 h-2" />
    <div className="font-bold">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
  </div>
);

const nodeTypes = {
  custom: CustomNode,
};

function FlowChart({ nodes, edges }) {
  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  const onInit = useCallback((reactFlowInstance) => {
    console.log('Flow initialized:', reactFlowInstance);
    reactFlowInstance.fitView();
  }, []);

  if (!nodes || !edges || nodes.length === 0) {
    return (
      <div className="h-[400px] bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center text-gray-400">
        No flow data available
      </div>
    );
  }

  return (
    <div className="h-[400px] bg-gray-900 rounded-lg border border-gray-700">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-900"
        defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
        minZoom={0.5}
        maxZoom={2}
      >
        <Background color="#4ade80" gap={16} size={1} />
        <Controls className="fill-green-500" />
        <Panel position="top-right" className="bg-gray-800 p-2 rounded text-gray-300 text-sm">
          Drag to move • Scroll to zoom
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default FlowChart;
