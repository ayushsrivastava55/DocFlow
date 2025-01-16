import { worqhat } from './worqhatService';

export const generateQuiz = async (documentationContent, questionCount = 10) => {
  try {
    const prompt = `Create a quiz with exactly ${questionCount} multiple choice questions based on this documentation. 
Each question should have 4 options with only one correct answer.

Required format (exactly follow this format):
[
  {
    "question": "What is...",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAnswer": "Option A"
  }
]

Documentation content: ${documentationContent}

Remember:
1. Response must be a valid JSON array
2. Each question must have exactly 4 options
3. Generate exactly ${questionCount} questions
4. Make sure the correctAnswer is exactly matching one of the options`;

    const response = await worqhat.generateText({
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 2048
    });

    if (!response?.content) {
      throw new Error('No content in response');
    }

    // Clean the response content to ensure it's valid JSON
    let cleanContent = response.content;
    // Remove any markdown code block indicators
    cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    // Trim whitespace
    cleanContent = cleanContent.trim();
    
    try {
      const quizData = JSON.parse(cleanContent);
      
      // Validate the quiz data structure
      if (!Array.isArray(quizData)) {
        throw new Error('Quiz data is not an array');
      }
      
      if (quizData.length !== questionCount) {
        throw new Error(`Quiz must have exactly ${questionCount} questions`);
      }
      
      // Validate each question's structure
      quizData.forEach((question, index) => {
        if (!question.question || !question.options || !question.correctAnswer) {
          throw new Error(`Question ${index + 1} is missing required fields`);
        }
        
        if (!Array.isArray(question.options) || question.options.length !== 4) {
          throw new Error(`Question ${index + 1} must have exactly 4 options`);
        }
        
        if (!question.options.includes(question.correctAnswer)) {
          throw new Error(`Question ${index + 1}'s correct answer must match one of its options`);
        }
      });
      
      return quizData;
    } catch (error) {
      console.error('Error parsing or validating quiz data:', error);
      console.error('Raw content:', cleanContent);
      throw new Error('Failed to parse quiz data: ' + error.message);
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};
