import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMermaid from 'remark-mermaid';

function FlowchartRenderer({ chart }) {
  const markdownContent = `\`\`\`mermaid
${chart}
\`\`\``;

  return (
    <div className="flowchart-wrapper bg-gray-900 p-4 rounded-lg">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMermaid]}
        className="prose prose-invert max-w-none"
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}

export default FlowchartRenderer;
