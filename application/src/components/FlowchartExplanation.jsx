import React, { useRef, useState, useEffect } from 'react';
import cytoscape from 'cytoscape';
import { useDocumentation } from '../context/DocumentationContext';
import { worqhat } from '../services/worqhatService';

const FlowchartExplanation = () => {
  const containerRef = useRef(null);
  const cytoscapeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeContent, setNodeContent] = useState(null);
  const { documentation } = useDocumentation();

  const extractSections = (content) => {
    if (!content) return [];
    const sections = content.split(/^#{1,3}\s+/m).filter(Boolean);
    return sections.map(section => {
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      return { title, content };
    });
  };

  const generateMainFlowchart = async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedNode(null);
      setNodeContent(null);

      const sections = extractSections(documentation?.content);
      console.log('Extracted sections:', sections);
      
      if (!sections || sections.length === 0) {
        throw new Error('No sections found in documentation');
      }

      const flowchartData = {
        nodes: [
          {
            id: 'main',
            label: sections[0]?.title || 'Documentation',
            type: 'main',
            color: '#B8E1FF'
          },
          ...sections.slice(1).map((section, index) => ({
            id: `section-${index + 1}`,
            label: section.title.replace(/\.\.\.$/, ''),
            type: 'section',
            color: '#FFD6A5'
          }))
        ],
        edges: sections.slice(1).map((_, index) => ({
          source: 'main',
          target: `section-${index + 1}`,
          label: 'contains'
        }))
      };

      await renderFlowchart(flowchartData);
    } catch (error) {
      console.error('Error generating flowchart:', error);
      setError('Error generating flowchart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderFlowchart = async (data) => {
    try {
      if (!containerRef.current) {
        console.error('Container ref not found');
        return;
      }

      if (cytoscapeRef.current) {
        cytoscapeRef.current.destroy();
        cytoscapeRef.current = null;
      }

      // Wait for DOM update
      await new Promise(resolve => setTimeout(resolve, 0));

      const cy = cytoscape({
        container: containerRef.current,
        elements: {
          nodes: data.nodes.map(node => ({
            data: { ...node }
          })),
          edges: data.edges.map(edge => ({
            data: {
              ...edge,
              id: `${edge.source}-${edge.target}`
            }
          }))
        },
        style: [
          {
            selector: 'node',
            style: {
              'background-color': 'data(color)',
              'label': 'data(label)',
              'text-wrap': 'wrap',
              'text-max-width': '120px',
              'font-size': '12px',
              'text-valign': 'center',
              'text-halign': 'center',
              'width': '150px',
              'height': '60px',
              'padding': '10px',
              'shape': 'roundrectangle',
              'border-width': '1px',
              'border-color': '#666',
              'border-opacity': 0.5,
              'color': '#fff',
              'text-outline-width': 1,
              'text-outline-color': '#222'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#666',
              'target-arrow-color': '#666',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': '10px',
              'text-rotation': 'autorotate',
              'text-margin-y': -10,
              'color': '#fff',
              'text-outline-width': 1,
              'text-outline-color': '#222'
            }
          }
        ],
        layout: {
          name: 'cose',
          padding: 50,
          animate: true,
          animationDuration: 500,
          nodeDimensionsIncludeLabels: true,
          refresh: 20,
          fit: true,
          randomize: true
        },
        wheelSensitivity: 0.2,
        minZoom: 0.5,
        maxZoom: 2
      });

      cytoscapeRef.current = cy;

      cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        const nodeId = node.id();
        const nodeLabel = node.data('label');

        if (nodeId === 'context') {
          generateMainFlowchart();
        } else if (nodeId !== 'main' && !nodeId.startsWith('detail')) {
          setSelectedNode(nodeLabel);
        }
      });

      cy.on('mouseover', 'node', function(evt) {
        const node = evt.target;
        node.style({
          'border-width': '2px',
          'border-color': '#fff'
        });
        containerRef.current.style.cursor = 'pointer';
      });

      cy.on('mouseout', 'node', function(evt) {
        const node = evt.target;
        node.style({
          'border-width': '1px',
          'border-color': '#666'
        });
        containerRef.current.style.cursor = 'default';
      });

      // Center and fit the graph
      cy.fit();
      cy.center();
    } catch (error) {
      console.error('Error rendering flowchart:', error);
      setError('Error displaying flowchart');
    }
  };

  useEffect(() => {
    if (documentation?.content) {
      generateMainFlowchart();
    }
    return () => {
      if (cytoscapeRef.current) {
        cytoscapeRef.current.destroy();
        cytoscapeRef.current = null;
      }
    };
  }, [documentation]);

  useEffect(() => {
    if (selectedNode) {
      generateNodeFlowchart(selectedNode);
    }
  }, [selectedNode]);

  const generateNodeFlowchart = async (nodeId) => {
    try {
      console.log('Generating flowchart for node:', nodeId);
      setLoading(true);
      setSelectedNode(nodeId);

      const prompt = `Create a detailed flowchart explaining the MySQL concept "${nodeId}". 
Focus on key components, relationships, and practical usage.

Return a JSON object with exactly this structure:
{
  "nodes": [
    {
      "id": "main",
      "label": "${nodeId}",
      "type": "concept",
      "color": "#B8E1FF"
    },
    {
      "id": "definition",
      "label": "Brief definition of ${nodeId}",
      "type": "detail",
      "color": "#FFD6A5"
    },
    {
      "id": "components",
      "label": "Key components",
      "type": "detail",
      "color": "#FFD6A5"
    },
    {
      "id": "usage",
      "label": "Common usage patterns",
      "type": "detail",
      "color": "#FFD6A5"
    },
    {
      "id": "example",
      "label": "SQL example",
      "type": "example",
      "color": "#CAFFBF"
    },
    {
      "id": "bestPractices",
      "label": "Best practices",
      "type": "detail",
      "color": "#FFD6A5"
    },
    {
      "id": "context",
      "label": "Back to Documentation",
      "type": "context",
      "color": "#BDB2FF"
    }
  ],
  "edges": [
    {
      "source": "main",
      "target": "definition",
      "label": "means"
    },
    {
      "source": "main",
      "target": "components",
      "label": "consists of"
    },
    {
      "source": "main",
      "target": "usage",
      "label": "used for"
    },
    {
      "source": "usage",
      "target": "example",
      "label": "shown in"
    },
    {
      "source": "main",
      "target": "bestPractices",
      "label": "follows"
    },
    {
      "source": "main",
      "target": "context",
      "label": "part of"
    }
  ]
}

Ensure that:
1. The definition is clear and concise
2. Components are specific to ${nodeId}
3. Usage patterns are practical
4. Example is a valid SQL query or command
5. Best practices are relevant to ${nodeId}`;

      const response = await worqhat.generateText({
        prompt,
        temperature: 0.3,
        maxTokens: 2048
      });

      console.log('Worqhat response:', response.content);

      // Extract JSON from response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Worqhat response');
      }

      let flowchartData;
      try {
        flowchartData = JSON.parse(jsonMatch[0].replace(/[\u0000-\u001F]+/g, ''));
        
        // Validate the structure
        if (!flowchartData.nodes || !flowchartData.edges || 
            !Array.isArray(flowchartData.nodes) || !Array.isArray(flowchartData.edges)) {
          throw new Error('Invalid flowchart data structure');
        }

        // Clean up node labels
        flowchartData.nodes = flowchartData.nodes.map(node => ({
          ...node,
          label: node.label.length > 40 ? node.label.slice(0, 37) + '...' : node.label
        }));

        console.log('Generated flowchart data from Worqhat:', flowchartData);
        await renderFlowchart(flowchartData);
        setNodeContent(flowchartData);
      } catch (error) {
        console.error('Error parsing Worqhat response:', error);
        throw new Error('Failed to parse Worqhat response');
      }

    } catch (error) {
      console.error('Error in generateNodeFlowchart:', error);
      setError('Failed to generate detailed flowchart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {selectedNode ? selectedNode : 'Documentation Flowchart'}
          </h2>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>
        {selectedNode && (
          <button
            onClick={() => {
              setSelectedNode(null);
              generateMainFlowchart();
            }}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Main Flowchart
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100">
          {error}
        </div>
      )}

      <div 
        ref={containerRef}
        className="flex-1 min-h-[500px] w-full"
        style={{ 
          backgroundColor: 'rgb(17, 24, 39)',
          position: 'relative'
        }}
      />
    </div>
  );
};

export default FlowchartExplanation;
