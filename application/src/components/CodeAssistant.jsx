import React, { useState, useRef, useEffect } from 'react';
import { getCodeAssistance, debugCode } from '../services/codeAssistService';

const CodeAssistant = ({ code, language, onCodeUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('assist'); // 'assist' or 'debug'
  const [errorMessage, setErrorMessage] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [response]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() && mode === 'assist') return;
    if (!errorMessage.trim() && mode === 'debug') return;

    setLoading(true);
    setError(null);

    try {
      let result;
      if (mode === 'assist') {
        result = await getCodeAssistance(prompt, code, language);
      } else {
        result = await debugCode(code, errorMessage, language);
      }

      if (result.success) {
        setResponse(result);
        if (mode === 'debug' && result.fixedCode) {
          onCodeUpdate(result.fixedCode);
        } else if (mode === 'assist' && result.codeChanges) {
          onCodeUpdate(result.codeChanges);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Code Assistant</h2>
          <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setMode('assist')}
              className={`px-3 py-1 text-sm ${
                mode === 'assist'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Assist
            </button>
            <button
              onClick={() => setMode('debug')}
              className={`px-3 py-1 text-sm ${
                mode === 'debug'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Debug
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Chat Container */}
      <div ref={chatContainerRef} className="h-96 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {response && (
          <div className="space-y-4">
            {mode === 'assist' ? (
              <>
                <div className="prose dark:prose-invert">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Explanation</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{response.explanation}</p>
                </div>

                {response.codeChanges && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Suggested Code</h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <pre className="text-gray-100 text-sm overflow-x-auto">
                        <code>{response.codeChanges}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {response.tips?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Tips</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                      {response.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="prose dark:prose-invert">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Error Explanation</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{response.errorExplanation}</p>
                </div>

                <div className="prose dark:prose-invert">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Solution</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{response.solution}</p>
                </div>

                {response.fixedCode && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Fixed Code</h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <pre className="text-gray-100 text-sm overflow-x-auto">
                        <code>{response.fixedCode}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-2">
          <textarea
            value={mode === 'assist' ? prompt : errorMessage}
            onChange={(e) => (mode === 'assist' ? setPrompt(e.target.value) : setErrorMessage(e.target.value))}
            placeholder={
              mode === 'assist'
                ? "Describe what you'd like to do with the code..."
                : 'Paste the error message here...'
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            rows={3}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : mode === 'assist' ? (
              'Get Help'
            ) : (
              'Debug'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CodeAssistant;
