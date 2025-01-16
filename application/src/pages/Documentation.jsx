import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentation } from '../context/DocumentationContext';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import FileUpload from '../components/FileUpload';
import TableOfContents from '../components/TableOfContents';
import SearchBar from '../components/SearchBar';
import BackToTop from '../components/BackToTop';
import TryItOutModal from '../components/TryItOutModal';
import DocAssistant from '../components/DocAssistant';
import QuizComponent from '../components/QuizComponent';
import { worqhat } from '../services/worqhatService';
import { FaCode } from 'react-icons/fa';

function Documentation() {
  const navigate = useNavigate();
  const { documentation, loading, error, processDocumentFile } = useDocumentation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContent, setFilteredContent] = useState('');
  const [isTryItOutOpen, setIsTryItOutOpen] = useState(false);
  const [tryItOutCode, setTryItOutCode] = useState('');
  const [tryItOutLanguage, setTryItOutLanguage] = useState('javascript');
  const [tryItOutDocumentation, setTryItOutDocumentation] = useState('');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [implementation, setImplementation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!documentation && !loading && !error) {
      console.log('No documentation found, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [documentation, loading, error, navigate]);

  useEffect(() => {
    if (documentation?.content) {
      setFilteredContent(documentation.content);
    }
  }, [documentation]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && documentation?.content) {
      const lowerCaseQuery = query.toLowerCase();
      const filteredContent = documentation.content.split('\n').filter(line => 
        line.toLowerCase().includes(lowerCaseQuery)
      ).join('\n');
      setFilteredContent(filteredContent || '');
    } else {
      setFilteredContent(documentation?.content || '');
    }
  };

  const handleTryItOut = (code, language, documentation) => {
    setTryItOutCode(code);
    setTryItOutLanguage(language || 'javascript');
    setTryItOutDocumentation(documentation);
    setIsTryItOutOpen(true);
  };

  const handleFileUpload = async (file) => {
    try {
      const success = await processDocumentFile(file);
      if (!success) {
        console.error('Failed to process document');
      }
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const generateImplementation = async () => {
    setIsGenerating(true);
    try {
      const response = await worqhat.generateText({
        prompt: `Based on this documentation, generate a complete implementation example with detailed comments explaining each part:

${documentation.content}

Please provide a practical, working implementation that demonstrates the key concepts from the documentation.
Include error handling, best practices, and comments explaining the code.`,
        temperature: 0.7,
        maxTokens: 2048
      });

      if (response?.content) {
        setImplementation(response.content);
      }
    } catch (error) {
      console.error('Error generating implementation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-green-400">Processing your documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
        <div className="max-w-xl w-full">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">Error: {error}</p>
          </div>
          <div className="bg-black rounded-lg shadow-lg p-6 border border-green-500/30">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Try uploading another document</h2>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </div>
      </div>
    );
  }

  if (!documentation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
        <div className="max-w-xl w-full">
          <div className="bg-black rounded-lg shadow-lg p-6 border border-green-500/30">
            <h2 className="text-xl font-semibold mb-4 text-green-400">No documentation loaded</h2>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row bg-black min-h-screen">
      {/* Left sidebar */}
      <div className="lg:w-64 bg-black border-r border-green-500/30 p-4">
        <SearchBar onSearch={handleSearch} />
        <TableOfContents content={documentation?.content || ''} />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 sticky top-0 bg-black/95 py-4 z-10 border-b border-green-500/30">
            <h1 className="text-2xl font-bold text-green-400">Documentation</h1>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => navigate('/quiz')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Test Yourself
              </button>
              
              <button
                onClick={generateImplementation}
                disabled={isGenerating}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Generate Code
              </button>
            </div>
          </div>

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const code = String(children).replace(/\n$/, '');
                
                if (!inline && match) {
                  return (
                    <div className="relative group">
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg"
                        {...props}
                      >
                        {code}
                      </SyntaxHighlighter>
                      <button
                        onClick={() => handleTryItOut(code, match[1], documentation?.content)}
                        className="absolute top-2 right-2 px-3 py-1 text-sm bg-green-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Try it out
                      </button>
                    </div>
                  );
                }
                return inline ? (
                  <code className="bg-green-900/20 text-green-400 px-1 py-0.5 rounded" {...props}>
                    {children}
                  </code>
                ) : (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match ? match[1] : 'text'}
                    PreTag="div"
                    className="rounded-lg"
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                );
              },
              p: ({node, ...props}) => <p className="text-gray-200 mb-4 leading-relaxed" {...props} />,
              h1: ({node, ...props}) => {
                const id = props.children[0].toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return <h1 id={id} className="text-3xl font-bold text-green-400 mb-6" {...props} />;
              },
              h2: ({node, ...props}) => {
                const id = props.children[0].toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return <h2 id={id} className="text-2xl font-bold text-green-400 mt-8 mb-4" {...props} />;
              },
              h3: ({node, ...props}) => {
                const id = props.children[0].toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return <h3 id={id} className="text-xl font-bold text-green-400 mt-6 mb-3" {...props} />;
              },
              a: ({node, ...props}) => <a className="text-green-400 hover:text-green-300 underline" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-200 mb-4 space-y-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-200 mb-4 space-y-2" {...props} />,
              li: ({node, ...props}) => <li className="text-gray-200" {...props} />,
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-green-500 pl-4 my-4 text-gray-300 bg-green-900/10 p-4 rounded-r" {...props} />
              ),
              table: ({node, ...props}) => (
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-green-500/30 text-gray-200" {...props} />
                </div>
              ),
              th: ({node, ...props}) => (
                <th className="border border-green-500/30 bg-green-900/20 px-4 py-2 text-green-400" {...props} />
              ),
              td: ({node, ...props}) => (
                <td className="border border-green-500/30 px-4 py-2 text-gray-200" {...props} />
              ),
              hr: ({node, ...props}) => <hr className="border-green-500/30 my-8" {...props} />,
              pre: ({node, ...props}) => <pre className="bg-gray-900 rounded-lg p-4 mb-4" {...props} />,
            }}
          >
            {filteredContent}
          </ReactMarkdown>

          {/* Implementation section */}
          {implementation && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-green-400 mb-4">Implementation Example</h2>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-gray-200">
                  <code>{implementation}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar for DocAssistant */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      </div>

      <BackToTop />

      {isTryItOutOpen && (
        <TryItOutModal
          isOpen={isTryItOutOpen}
          onClose={() => setIsTryItOutOpen(false)}
          initialCode={tryItOutCode}
          language={tryItOutLanguage}
          documentation={tryItOutDocumentation}
        />
      )}

      <DocAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        content={documentation.content}
        sections={documentation.sections}
      />
    </div>
  );
}

export default Documentation;
