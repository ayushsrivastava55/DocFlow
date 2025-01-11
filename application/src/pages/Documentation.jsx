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
    <div className="min-h-screen bg-black">
      <SearchBar onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <TableOfContents sections={documentation.sections} />
          </div>
          <div className="col-span-9">
            <div className="bg-black rounded-lg shadow-lg p-6 border border-green-500/30">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-green-400">Documentation</h1>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleTryItOut(documentation.content, 'javascript', documentation.content)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Try it out
                  </button>
                  <button
                    onClick={() => setIsAssistantOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    AI Assistant
                  </button>
                </div>
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    
                    if (inline) {
                      return (
                        <code className="bg-green-900/20 text-green-400 rounded px-1 py-0.5" {...props}>
                          {children}
                        </code>
                      );
                    }

                    if (language === 'mermaid') {
                      return (
                        <div className="mermaid my-4 bg-black text-green-400">
                          {String(children).replace(/\n$/, '')}
                        </div>
                      );
                    }

                    return (
                      <div className="relative group">
                        <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleTryItOut(String(children), language, documentation.content)}
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Try it out
                          </button>
                          <button
                            onClick={() => navigator.clipboard.writeText(String(children))}
                            className="bg-gray-700 text-white px-2 py-1 rounded text-sm hover:bg-gray-600 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={language}
                          PreTag="div"
                          className="bg-black border border-green-500/30 rounded-lg"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    );
                  },
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
                  p: ({node, ...props}) => <p className="text-gray-300 mb-4" {...props} />,
                  a: ({node, ...props}) => <a className="text-green-400 hover:text-green-300" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-300 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-300 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="mb-2" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-green-500 pl-4 my-4 text-gray-300 bg-green-900/10 p-4 rounded-r" {...props} />
                  ),
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto mb-6">
                      <table className="min-w-full border border-green-500/30 text-gray-300" {...props} />
                    </div>
                  ),
                  th: ({node, ...props}) => (
                    <th className="border border-green-500/30 bg-green-900/20 px-4 py-2 text-green-400" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="border border-green-500/30 px-4 py-2" {...props} />
                  ),
                  hr: ({node, ...props}) => <hr className="border-green-500/30 my-8" {...props} />,
                }}
                className="prose prose-invert max-w-none"
              >
                {filteredContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      <BackToTop />

      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-colors flex items-center gap-2 z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="hidden md:inline">Ask AI Assistant</span>
      </button>

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
