import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/quizService';
import { worqhat } from '../services/worqhatService';

const QuizComponent = ({ documentationContent }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [studyingConcept, setStudyingConcept] = useState(null);
  const [conceptExplanation, setConceptExplanation] = useState('');
  const [loadingConcept, setLoadingConcept] = useState(false);

  const resetQuiz = () => {
    setQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(0);
    setShowResults(false);
    setShowQuiz(false);
    setError(null);
    setStudyingConcept(null);
    setConceptExplanation('');
  };

  const loadQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const quizData = await generateQuiz(documentationContent, questionCount);
      if (quizData && Array.isArray(quizData)) {
        setQuiz(quizData);
        setShowQuiz(true);
      } else if (quizData && quizData.content) {
        try {
          const parsedQuiz = JSON.parse(quizData.content);
          if (Array.isArray(parsedQuiz)) {
            setQuiz(parsedQuiz);
            setShowQuiz(true);
          } else {
            setError('Invalid quiz format received');
          }
        } catch (err) {
          console.error('Error parsing quiz:', err);
          setError('Failed to parse quiz data');
        }
      } else {
        setError('Failed to generate quiz. Please try again.');
      }
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Error generating quiz: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer
    });
  };

  const handleNextQuestion = () => {
    if (selectedAnswers[currentQuestion] === quiz[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRetry = () => {
    resetQuiz();
  };

  const handleStartQuiz = async () => {
    setLoading(true);
    setError(null);
    setShowQuiz(true);
    
    try {
      const quizData = await generateQuiz(documentationContent, questionCount);
      if (quizData && Array.isArray(quizData)) {
        setQuiz(quizData);
      } else {
        throw new Error('Invalid quiz format received');
      }
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Error generating quiz: ' + err.message);
      setShowQuiz(false);
    } finally {
      setLoading(false);
    }
  };

  const getOptionClassName = (questionIndex, option) => {
    if (!showResults) return '';
    
    const isSelected = selectedAnswers[questionIndex] === option;
    const isCorrect = quiz[questionIndex].correctAnswer === option;
    
    if (isCorrect) {
      return 'bg-green-600/90 border-2 border-green-400 text-white shadow-lg shadow-green-500/20';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-600/90 border-2 border-red-400 text-white shadow-lg shadow-red-500/20';
    }
    return 'bg-gray-700/50 border border-gray-600 text-gray-300';
  };

  const handleStudyConcept = async (questionIndex) => {
    setLoadingConcept(true);
    setStudyingConcept(questionIndex);
    setConceptExplanation('');

    try {
      const question = quiz[questionIndex];
      const prompt = `Based on this question from the documentation:
Question: "${question.question}"
Correct Answer: "${question.correctAnswer}"

Please provide:
1. A detailed explanation of the concept
2. Why the correct answer is right
3. Examples if applicable
4. Additional related information that might help understand this better

Use the following documentation content for context:
${documentationContent}`;

      const response = await worqhat.generateText({
        prompt: prompt,
        temperature: 0.7,
        maxTokens: 1024
      });

      if (response?.content) {
        setConceptExplanation(response.content);
      }
    } catch (error) {
      console.error('Error getting concept explanation:', error);
      setConceptExplanation('Failed to load explanation. Please try again.');
    } finally {
      setLoadingConcept(false);
    }
  };

  const handleCloseExplanation = () => {
    setStudyingConcept(null);
    setConceptExplanation('');
  };

  if (!showQuiz) {
    return (
      <div className="my-8">
        <div className="max-w-xl mx-auto p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Configure Your Quiz</h3>
          
          <div className="mb-6">
            <label htmlFor="questionCount" className="block text-gray-300 mb-2">
              Number of Questions
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="questionCount"
                min="5"
                max="20"
                step="1"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="w-16 px-3 py-2 bg-gray-700 rounded-lg text-center text-white">
                {questionCount}
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Select between 5 and 20 questions
            </p>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg font-semibold hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-green-500 border-b-transparent rounded-full animate-pulse opacity-50"></div>
        </div>
        
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-3">Generating Your Quiz</h3>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-gray-400 max-w-md">
              Analyzing documentation and creating {questionCount} personalized questions...
            </p>
            <div className="flex items-center space-x-2 text-gray-500 text-sm mt-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <div className="h-2 w-48 bg-gray-700 rounded animate-pulse mx-auto"></div>
            <div className="h-2 w-32 bg-gray-700 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-red-500/30">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg className="text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-400 mb-3">Error Generating Quiz</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Quiz Complete!</h2>
          <p className="text-xl text-green-400">
            Your Score: {score} out of {quiz.length}
          </p>
        </div>

        <div className="space-y-8">
          {quiz.map((question, index) => (
            <div key={index} className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
              <div className="flex items-start justify-between gap-4">
                <p className="text-lg font-semibold mb-4 text-white flex-1">
                  <span className="inline-block w-8 h-8 leading-8 text-center bg-gray-700 rounded-full mr-3">
                    {index + 1}
                  </span>
                  {question.question}
                </p>
                {selectedAnswers[index] === question.correctAnswer ? (
                  <span className="flex items-center px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Correct
                  </span>
                ) : (
                  <span className="flex items-center px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Incorrect
                  </span>
                )}
              </div>

              <div className="space-y-3 mt-4">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-4 rounded-lg transition-all duration-200 ${getOptionClassName(index, option)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-600/50 text-sm">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span>{option}</span>
                      {quiz[index].correctAnswer === option && (
                        <svg className="w-5 h-5 ml-auto text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                {selectedAnswers[index] !== question.correctAnswer && (
                  <p className="text-red-400 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Your answer: {selectedAnswers[index]}
                  </p>
                )}
                
                {studyingConcept === index ? (
                  <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600 w-full">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-white">Concept Explanation</h4>
                      <button
                        onClick={handleCloseExplanation}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {loadingConcept ? (
                      <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-gray-300">
                          {conceptExplanation}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleStudyConcept(index)}
                    className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-sm flex items-center gap-2 hover:scale-105 ml-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Study This Concept
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-lg font-semibold hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <p className="text-lg text-gray-300">
          Question {currentQuestion + 1} of {quiz.length}
        </p>
        <p className="text-lg text-green-400">Score: {score}</p>
      </div>

      <div className="mb-8">
        <p className="text-xl font-semibold mb-6 text-white">
          {quiz[currentQuestion].question}
        </p>
        <div className="space-y-4">
          {quiz[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-4 text-left rounded-lg transition-all duration-200 transform hover:scale-[1.01] ${
                selectedAnswers[currentQuestion] === option
                  ? 'bg-blue-600/90 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/20'
                  : 'bg-gray-700/50 hover:bg-gray-700 text-gray-100 border border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm ${
                  selectedAnswers[currentQuestion] === option
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNextQuestion}
          disabled={!selectedAnswers[currentQuestion]}
          className={`px-6 py-3 rounded-lg transition-all duration-200 ${
            selectedAnswers[currentQuestion]
              ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 shadow-lg hover:shadow-green-500/20'
              : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQuestion === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default QuizComponent;
