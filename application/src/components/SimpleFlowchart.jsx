import React from 'react';

function SimpleFlowchart({ steps }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-gray-400 text-center p-4">
        No flowchart data available
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md text-center">
            {step}
          </div>
          {index < steps.length - 1 && (
            <div className="h-8 w-0.5 bg-green-500 relative">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 rotate-45 border-r-2 border-b-2 border-green-500"></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default SimpleFlowchart;
