import React, { useState, useRef, useEffect } from 'react';
import { worqhat } from '../services/worqhatService';

const ChatComponent = ({ context }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await worqhat.generateText({
        prompt: \`Context: You are an AI assistant helping with \${context}. 
                Question: \${inputMessage}
                Please provide a helpful and concise response.\`,
        temperature: 0.7,
        maxTokens: 1024,
      });

      const aiMessage = {
        type: 'assistant',
        content: response.content || "I'm sorry, I couldn't process that request.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        type: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] max-h-[80vh]">
      {/* Chat Header */}
      <div className="bg-gray-700 p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-200 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-700 rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
