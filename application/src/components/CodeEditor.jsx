import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodeAssistant from './CodeAssistant';

const CodeEditor = ({ code, language, readOnly = false }) => {
  const [editorContent, setEditorContent] = useState(code);
  const [showCopied, setShowCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorContent);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleEditorChange = (value) => {
    setEditorContent(value);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {language}
          </span>
          {!readOnly && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm text-green-500 hover:text-green-600 dark:hover:text-green-400"
            >
              {isEditing ? 'Preview' : 'Edit'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-sm text-gray-600 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
          >
            {showCopied ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="relative">
        {isEditing ? (
          <div className="relative h-full">
            <Editor
              height="100%"
              defaultLanguage={language.toLowerCase()}
              value={editorContent}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                automaticLayout: true,
              }}
            />
            
            <CodeAssistant 
              code={editorContent}
              language={language}
              onCodeUpdate={(newCode) => handleEditorChange(newCode)}
            />
          </div>
        ) : (
          <SyntaxHighlighter
            language={language.toLowerCase()}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              padding: '1rem',
            }}
          >
            {editorContent}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
