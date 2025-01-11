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

export const getCodeAssistance = async (prompt, code, language) => {
  try {
    const systemMessage = `You are an expert ${language} developer. Help users write, debug, and improve their code. Provide clear, concise solutions with explanations.`;

    const response = await worqhatApi.post('', {
      question: `Code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nUser Request: ${prompt}\n\nProvide:\n1. Solution/explanation\n2. Code changes (if needed)\n3. Best practices/tips`,
      model: 'aicon-v4-nano-160824',
      randomness: 0.3,
      stream_data: true,
      training_data: systemMessage,
      response_type: 'json'
    }, {
      responseType: 'text'
    });

    if (response.status === 200) {
      const content = parseStreamedResponse(response.data);
      try {
        const parsed = JSON.parse(content);
        return {
          success: true,
          explanation: parsed.explanation || '',
          codeChanges: parsed.codeChanges || null,
          tips: parsed.tips || []
        };
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        return {
          success: true,
          explanation: content,
          codeChanges: null,
          tips: []
        };
      }
    } else {
      return {
        success: false,
        error: 'Failed to get assistance'
      };
    }
  } catch (error) {
    console.error('Code assistant error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get assistance'
    };
  }
};

export const debugCode = async (code, error, language) => {
  try {
    const systemMessage = `You are an expert ${language} debugger. Help users fix their code errors with clear explanations and solutions.`;

    const response = await worqhatApi.post('', {
      question: `Code with error:\n\`\`\`${language}\n${code}\n\`\`\`\n\nError message:\n${error}\n\nProvide:\n1. Error explanation\n2. Solution\n3. Fixed code`,
      model: 'aicon-v4-nano-160824',
      randomness: 0.3,
      stream_data: true,
      training_data: systemMessage,
      response_type: 'json'
    }, {
      responseType: 'text'
    });

    if (response.status === 200) {
      const content = parseStreamedResponse(response.data);
      try {
        const parsed = JSON.parse(content);
        return {
          success: true,
          errorExplanation: parsed.errorExplanation || '',
          solution: parsed.solution || '',
          fixedCode: parsed.fixedCode || null
        };
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        return {
          success: true,
          errorExplanation: content,
          solution: '',
          fixedCode: null
        };
      }
    } else {
      return {
        success: false,
        error: 'Failed to debug code'
      };
    }
  } catch (error) {
    console.error('Debug assistant error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to debug code'
    };
  }
};
