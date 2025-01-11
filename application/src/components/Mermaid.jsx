import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with dark theme
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  flowchart: {
    curve: 'basis',
    defaultRenderer: 'dagre'
  }
});

function Mermaid({ chart }) {
  const elementRef = useRef(null);
  const chartId = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart || !elementRef.current) return;

      try {
        // Clear previous content
        elementRef.current.innerHTML = '';
        
        // Clean up the chart
        let processedChart = chart
          .replace(/^```mermaid\n?/, '')
          .replace(/```$/, '')
          .trim();

        // Ensure it starts with graph TD
        if (!processedChart.startsWith('graph TD')) {
          processedChart = 'graph TD\n' + processedChart;
        }

        console.log('Rendering chart:', processedChart);

        // Render new chart
        const { svg } = await mermaid.render(chartId.current, processedChart);
        elementRef.current.innerHTML = svg;
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        elementRef.current.innerHTML = `
          <div class="text-red-500 p-4 rounded-lg border border-red-500">
            Error rendering flowchart: ${error.message}
          </div>
        `;
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div 
      ref={elementRef}
      className="mermaid bg-gray-900 p-4 rounded-lg overflow-x-auto"
    />
  );
}

export default Mermaid;
