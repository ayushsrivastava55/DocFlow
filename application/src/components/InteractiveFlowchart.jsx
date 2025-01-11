import React from 'react';
import MermaidFlowchart from './MermaidFlowchart';

const InteractiveFlowchart = ({ content, flowchartData }) => {
  if (!flowchartData || !flowchartData.content) return null;

  const { content: mermaidContent, sections } = flowchartData;

  return (
    <div className="space-y-4">
      {/* Flowchart Display */}
      <MermaidFlowchart content={mermaidContent} />

      {/* Sections Covered */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-400 mb-2">
          This flowchart explains:
        </h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {sections.map((sectionId, index) => (
            <li key={sectionId}>
              <a
                href={`#${sectionId}`}
                className="hover:text-green-400 transition-colors"
              >
                Section {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InteractiveFlowchart;
