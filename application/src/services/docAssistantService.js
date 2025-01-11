import axios from 'axios';

const API_KEY = import.meta.env.VITE_WORQHAT_API_KEY;
const API_URL = 'https://api.worqhat.com/api/ai/content/v4';

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

if (!API_KEY) {
  console.error('Missing Worqhat API key. Please add VITE_WORQHAT_API_KEY to your .env file');
}

export const getDocumentationHelp = async (question, documentation, sections) => {
  try {
    // Prepare context from documentation and sections
    const context = `
Documentation Content:
${documentation}

Table of Contents:
${sections.map(section => section.title).join('\n')}
`;

    const formData = new FormData();
    formData.append("question", `Based on the following documentation, answer this question: ${question}`);
    formData.append("model", "aicon-v4-nano-160824");
    formData.append("training_data", `You are a helpful documentation assistant. Your role is to:
1. Answer questions based on the provided documentation
2. If the answer isn't in the docs, use your knowledge but mention it's not from the docs
3. Keep responses clear and concise
4. Include code examples when relevant
5. Format responses in markdown when appropriate

Documentation Context:
${context}`);
    formData.append("stream_data", "false");
    formData.append("response_type", "text");

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('AI Assistant Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error('Failed to get response from AI assistant');
    }

    const data = await response.json();
    if (data && data.content) {
      return data.content;
    }

    throw new Error('Invalid response format from API');
  } catch (error) {
    console.error('Error in getDocumentationHelp:', error);
    throw error;
  }
};
