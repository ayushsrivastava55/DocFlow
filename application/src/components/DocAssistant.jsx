import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getDocumentationHelp } from '../services/docAssistantService';

const DocAssistant = ({ isOpen, onClose, content, sections }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', content: 'Hi! I\'m your documentation assistant. Ask me anything about the documentation!' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQuestion = question.trim();
    setQuestion('');
    
    // Add user message immediately
    setMessages(prev => [...prev, { type: 'user', content: userQuestion }]);
    setIsLoading(true);

    try {
      const response = await getDocumentationHelp(userQuestion, content, sections);
      
      // Add bot response
      setMessages(prev => [...prev, { type: 'bot', content: response }]);
    } catch (err) {
      // Add error message
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
      console.error('DocAssistant error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent form submission from refreshing the page
  const preventSubmit = useCallback((e) => {
    e.preventDefault();
    return false;
  }, []);

  useEffect(() => {
    // Add event listener to prevent form submission
    const form = document.querySelector('#doc-assistant-form');
    if (form) {
      form.addEventListener('submit', preventSubmit);
      return () => form.removeEventListener('submit', preventSubmit);
    }
  }, [preventSubmit]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-black border border-green-500/30 rounded-lg shadow-lg overflow-hidden z-50 flex flex-col"
         style={{ height: '500px', maxHeight: '80vh' }}>
      {/* Header */}
      <div className="p-4 border-b border-green-500/30 flex justify-between items-center bg-black">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="text-lg font-semibold text-green-400">Doc Assistant</h3>
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }} 
          className="text-gray-400 hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} 
           className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} 
               className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              message.type === 'user' 
                ? 'bg-green-500 text-white' 
                : message.type === 'error'
                ? 'bg-red-900/20 border border-red-500/30 text-red-400'
                : 'bg-gray-900 border border-green-500/30 text-gray-300'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-900 border border-green-500/30 rounded-lg p-3">
              <div className="flex gap-2 items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form 
        id="doc-assistant-form"
        onSubmit={handleSubmit} 
        className="p-4 border-t border-green-500/30 bg-black"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about the documentation..."
            className="flex-1 px-4 py-2 bg-gray-900 border border-green-500/30 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white ${
              isLoading
                ? 'bg-green-600 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } transition-colors flex items-center gap-2`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocAssistant;
