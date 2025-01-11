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

const worqhatApi = axios.create({
  baseURL: API_URL,
  headers: headers
});

const parseStreamedResponse = (text) => {
  const chunks = text.split('\n').filter(Boolean);
  let fullContent = '';
  
  chunks.forEach(chunk => {
    try {
      const jsonStr = chunk.replace(/^data: /, '');
      const data = JSON.parse(jsonStr);
      if (data.content) {
        fullContent += data.content;
      }
    } catch (e) {
      console.error('Error parsing chunk:', e);
    }
  });
  
  return fullContent;
};

export const generateCodeImplementation = async (documentation, language) => {
  try {
    let systemMessage;
    if (language === 'mysql') {
      systemMessage = `You are an expert MySQL database developer. Generate clean, efficient, and working SQL queries based on the documentation provided. Focus on writing optimized queries following best practices. Include necessary CREATE TABLE statements if needed.`;
    } else {
      systemMessage = `You are an expert ${language} developer. Generate clean, efficient, and working code based on the documentation provided. Focus only on the implementation, no explanations needed.`;
    }
    
    const response = await worqhatApi.post('', {
      question: `Based on this documentation:\n\n${documentation}\n\nGenerate a working ${language === 'mysql' ? 'SQL query' : 'code implementation'} in ${language}. Only provide the ${language === 'mysql' ? 'SQL' : 'code'}, no explanations.`,
      model: 'aicon-v4-nano-160824',
      randomness: 0.3,
      stream_data: true,
      training_data: systemMessage,
      response_type: 'text'
    }, {
      responseType: 'text'
    });

    if (response.status === 200) {
      const code = parseStreamedResponse(response.data);
      return {
        success: true,
        code: code.trim()
      };
    } else {
      return {
        success: false,
        error: 'Failed to generate code implementation'
      };
    }
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to generate code'
    };
  }
};

export const improveCode = async (code, language, error) => {
  try {
    let systemMessage;
    if (language === 'mysql') {
      systemMessage = `You are an expert MySQL database developer. Fix and optimize the SQL query while maintaining its original functionality. Consider query performance and best practices. Provide only the corrected SQL without explanations.`;
    } else {
      systemMessage = `You are an expert ${language} developer and debugger. Fix the code while maintaining its original functionality. Provide only the corrected code without explanations.`;
    }

    const response = await worqhatApi.post('', {
      question: `Fix this ${language} ${language === 'mysql' ? 'query' : 'code'} that produced the following error:\n\nCode:\n${code}\n\nError:\n${error}\n\nProvide only the corrected ${language === 'mysql' ? 'SQL' : 'code'}, no explanations.`,
      model: 'aicon-v4-nano-160824',
      randomness: 0.2,
      stream_data: true,
      training_data: systemMessage,
      response_type: 'text'
    }, {
      responseType: 'text'
    });

    if (response.status === 200) {
      const improvedCode = parseStreamedResponse(response.data);
      return {
        success: true,
        code: improvedCode.trim()
      };
    } else {
      return {
        success: false,
        error: 'Failed to improve code'
      };
    }
  } catch (error) {
    console.error('AI improvement error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to improve code'
    };
  }
};
