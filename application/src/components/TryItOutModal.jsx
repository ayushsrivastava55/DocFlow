import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Dialog } from '@headlessui/react';
import { executeCode, getSupportedLanguages } from '../services/codeExecutionService';
import { generateCodeImplementation, improveCode } from '../services/aiAssistService';

const TryItOutModal = ({ isOpen, onClose, initialCode = '', language = 'javascript', documentation = '' }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadLanguages = async () => {
      setIsLoadingLanguages(true);
      try {
        const languages = await getSupportedLanguages();
        setSupportedLanguages(languages);
      } catch (error) {
        console.error('Failed to load languages:', error);
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    loadLanguages();
  }, []);

  useEffect(() => {
    setCode(initialCode);
    setSelectedLanguage(language);
    setOutput('');
    setError(null);
  }, [initialCode, language]);

  const handleLanguageChange = async (lang) => {
    setSelectedLanguage(lang);
    if (documentation && (!code || code === initialCode)) {
      await generateImplementation(lang);
    }
  };

  const generateImplementation = async (lang = selectedLanguage) => {
    if (!documentation) return;

    setIsGenerating(true);
    try {
      const result = await generateCodeImplementation(documentation, lang);
      if (result.success) {
        setCode(result.code);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImproveCode = async () => {
    if (!error) return;

    setIsGenerating(true);
    try {
      const result = await improveCode(code, selectedLanguage, error);
      if (result.success) {
        setCode(result.code);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');

    try {
      const result = await executeCode(code, selectedLanguage);
      if (result.success) {
        setOutput(result.output);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl min-h-[80vh] shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Try it out - Interactive Code Editor
              </Dialog.Title>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                disabled={isLoadingLanguages}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 disabled:opacity-50"
              >
                {isLoadingLanguages ? (
                  <option>Loading languages...</option>
                ) : (
                  supportedLanguages.map(lang => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))
                )}
              </select>
              {documentation && (
                <button
                  onClick={() => generateImplementation()}
                  disabled={isGenerating}
                  className={`px-4 py-1 rounded-md text-sm font-medium text-white
                    ${isGenerating 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                    } transition-colors`}
                >
                  {isGenerating ? 'Generating...' : 'Generate Implementation'}
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-2 gap-0 h-[calc(80vh-4rem)]">
            {/* Editor Section */}
            <div className="border-r border-gray-200 dark:border-gray-700">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Editor ({selectedLanguage})
                  </span>
                  <div className="flex items-center gap-2">
                    {error && (
                      <button
                        onClick={handleImproveCode}
                        disabled={isGenerating}
                        className={`px-3 py-1 rounded-md text-xs font-medium text-white
                          ${isGenerating 
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-yellow-500 hover:bg-yellow-600'
                          } transition-colors`}
                      >
                        {isGenerating ? 'Improving...' : 'AI Fix'}
                      </button>
                    )}
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
                </div>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    defaultLanguage={selectedLanguage.toLowerCase()}
                    value={code}
                    onChange={(value) => setCode(value)}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      wordWrap: 'on',
                      automaticLayout: true,
                      suggestOnTriggerCharacters: true,
                      formatOnPaste: true,
                      formatOnType: true,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="flex flex-col">
              <div className="p-2 bg-gray-100 dark:bg-gray-900">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Output
                </span>
              </div>
              <div className="flex-1 bg-gray-900 p-4 font-mono text-sm overflow-auto">
                <div className="text-gray-400 mb-2">Program Output:</div>
                {error ? (
                  <div className="text-red-400 whitespace-pre-wrap">{error}</div>
                ) : (
                  <pre className="text-gray-100 whitespace-pre-wrap">{output}</pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TryItOutModal;
