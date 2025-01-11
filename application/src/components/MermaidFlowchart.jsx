import React, { useEffect } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with dark theme
mermaid.initialize({
  theme: 'dark',
  darkMode: true,
  themeVariables: {
    primaryColor: '#4ade80',
    primaryTextColor: '#fff',
    primaryBorderColor: '#4ade80',
    lineColor: '#4ade80',
    secondaryColor: '#374151',
    tertiaryColor: '#1f2937'
  }
});

const MermaidFlowchart = ({ content }) => {
  useEffect(() => {
    mermaid.contentLoading = true;
    mermaid.init();
  }, [content]);

  return (
    <div className="mermaid-wrapper bg-gray-800 p-6 rounded-lg">
      <div className="mermaid">
        {content}
      </div>
    </div>
  );
};

export default MermaidFlowchart;
