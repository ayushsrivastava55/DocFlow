import axios from 'axios';

const API_KEY = import.meta.env.VITE_WORQHAT_API_KEY;
const API_URL = 'https://api.worqhat.com/api/ai/content/v4';
const TEXT_API_URL = 'https://api.worqhat.com/api/ai/content/v2';

if (!API_KEY) {
  console.error('Missing Worqhat API key. Please add VITE_WORQHAT_API_KEY to your .env file');
}

export const worqhat = {
  generateText: async ({ prompt, temperature = 0.7, maxTokens = 2048 }) => {
    try {
      if (!API_KEY) {
        throw new Error('API key is missing');
      }

      const response = await axios.post(
        TEXT_API_URL,
        {
          question: prompt,
          randomness: temperature,
          max_tokens: maxTokens,
          type: 'text',
          format: 'json'
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  },

  processDocument: async function(file) {
    try {
      if (!file || !(file instanceof File)) {
        throw new Error('Invalid file provided');
      }

      if (!API_KEY) {
        throw new Error('API key is missing');
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a PDF, TXT, DOC, or DOCX file.');
      }

      console.log('Processing file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const formdata = new FormData();
      formdata.append("question", `Create a comprehensive documentation with the following structure:

1. Overall TL;DR at the start
2. Break down the content into logical sections
3. For each section:
   - Section title (as ## heading)
   - TL;DR summary in a blockquote
   - Detailed explanation with examples
   - Code snippets with comments (if applicable)
   - Common use cases
   - Best practices
   - Troubleshooting tips (if relevant)
4. Format requirements:
   - Use markdown formatting
   - Code blocks should specify language
   - Important notes in blockquotes
   - Use tables for structured data
   - Use bullet points for lists
   - Add horizontal rules between sections`);
      formdata.append("model", "aicon-v4-nano-160824");
      formdata.append("files", file);
      formdata.append("training_data", `You are a senior technical writer who excels at creating engaging, user-friendly documentation. Your documentation should:

1. Start with a clear overall TL;DR
2. Break content into logical sections
3. Each section should have:
   - Clear title
   - TL;DR summary
   - Detailed explanation
   - Code examples with comments
   - Use cases
   - Best practices
4. Use markdown features:
   - Code blocks with language specification
   - Blockquotes for important notes
   - Tables for structured data
   - Lists for steps and items
5. Make content engaging:
   - Use clear, concise language
   - Provide practical examples
   - Include troubleshooting tips
   - Add best practices
   - Reference real-world scenarios`);
      formdata.append("stream_data", "false");
      formdata.append("response_type", "text");

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        body: formdata
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Failed to process document: ${response.status} - ${errorData}`);
      }

      const result = await response.text();
      const data = JSON.parse(result);
      if (!data || !data.content) {
        throw new Error('Invalid response from API');
      }

      // Process the content to ensure proper section formatting
      const content = data.content;
      const sections = [];
      let currentSection = null;
      
      // Split content into lines and process sections
      const lines = content.split('\n');
      let currentContent = '';
      
      lines.forEach(line => {
        const h1Match = line.match(/^# (.+)/);
        const h2Match = line.match(/^## (.+)/);
        
        if (h1Match || h2Match) {
          // Save previous section if exists
          if (currentSection) {
            currentSection.content = currentContent.trim();
            sections.push(currentSection);
          }
          
          // Create new section
          currentSection = {
            title: (h1Match || h2Match)[1],
            level: h1Match ? 1 : 2,
            content: '',
            subsections: []
          };
          currentContent = '';
        } else {
          currentContent += line + '\n';
        }
      });
      
      // Add the last section
      if (currentSection && currentContent.trim()) {
        currentSection.content = currentContent.trim();
        sections.push(currentSection);
      }

      // Organize sections into hierarchy
      const mainSections = sections.filter(s => s.level === 1);
      const subSections = sections.filter(s => s.level === 2);

      mainSections.forEach(main => {
        main.subsections = subSections.filter(sub => {
          const mainIndex = sections.indexOf(main);
          const subIndex = sections.indexOf(sub);
          const nextMainIndex = sections.findIndex((s, i) => i > mainIndex && s.level === 1);
          return subIndex > mainIndex && (nextMainIndex === -1 || subIndex < nextMainIndex);
        });
      });

      return {
        content: content,
        sections: mainSections
      };

    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }
};
