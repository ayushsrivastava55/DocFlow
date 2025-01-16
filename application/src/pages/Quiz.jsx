import React from 'react';
import { useDocumentation } from '../context/DocumentationContext';
import QuizComponent from '../components/QuizComponent';
import DocAssistant from '../components/DocAssistant';

const Quiz = () => {
  const { documentation } = useDocumentation();

  if (!documentation?.content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please select a documentation file first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto relative pb-24">
        {/* Quiz Content */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
            Test Your Knowledge
          </h1>
          <QuizComponent documentationContent={documentation.content} />
        </div>

        {/* Fixed DocAssistant */}
        <div className="fixed bottom-24 right-4 md:right-8 z-20">
          <div className="bg-gray-800 rounded-lg shadow-xl w-80 md:w-96">
            <DocAssistant />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
