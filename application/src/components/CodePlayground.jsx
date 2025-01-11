import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';

const CodePlayground = ({ initialCode, language }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');

    try {
      // For JavaScript code
      if (language.toLowerCase() === 'javascript') {
        try {
          // Create a safe evaluation environment
          const safeEval = new Function('console', `
            let log = [];
            const customConsole = {
              log: (...args) => log.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ')),
              error: (...args) => log.push('Error: ' + args.join(' ')),
              warn: (...args) => log.push('Warning: ' + args.join(' '))
            };
            try {
              ${code}
            } catch (e) {
              customConsole.error(e.message);
            }
            return log.join('\\n');
          `);
          
          const result = safeEval(console);
          setOutput(result);
        } catch (e) {
          setError(e.message);
        }
      } else {
        setOutput('Running code in languages other than JavaScript is not supported in the browser. Consider using a backend service for other languages.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  }, [code, language]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Interactive {language} Playground
        </span>
        <button
          onClick={runCode}
          disabled={isRunning}
          className={`px-4 py-1 rounded-md text-sm font-medium text-white
            ${isRunning 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
            } transition-colors`}
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Running...
            </span>
          ) : (
            'Run Code'
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">
        <div className="h-[400px]">
          <Editor
            height="100%"
            defaultLanguage={language.toLowerCase()}
            defaultValue={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              automaticLayout: true,
            }}
          />
        </div>
        
        <div className="h-[400px] bg-gray-900 text-gray-100 p-4 font-mono text-sm overflow-auto">
          <div className="mb-2 text-gray-400">Output:</div>
          {error ? (
            <div className="text-red-400">{error}</div>
          ) : (
            <pre className="whitespace-pre-wrap">{output}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
