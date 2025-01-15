# DocFlow - Interactive Documentation Platform

DocFlow is a modern, feature-rich documentation platform that combines interactive learning experiences with AI-powered assistance. It provides an intuitive interface for creating, managing, and exploring documentation with features like interactive flowcharts, code playgrounds, and AI-assisted documentation.

## 📸 Project Screenshots

### Homepage & Landing

<img src="https://github.com/ayushsrivastava55/DocFlow/blob/main/application/screenshots/Screenshot%202025-01-11%20at%208.07.44%E2%80%AFPM.png" alt="DocFlow Homepage" width="800"/>

_The modern and intuitive landing page of DocFlow, showcasing key features and easy navigation._

### Documentation Interface

<img src="https://github.com/ayushsrivastava55/DocFlow/blob/main/application/screenshots/Screenshot%202025-01-11%20at%208.08.24%E2%80%AFPM.png" alt="Documentation Interface" width="800"/>

_Our comprehensive documentation interface with dynamic table of contents and interactive content._

### AI Assistant Integration

<img src="https://github.com/ayushsrivastava55/DocFlow/blob/main/application/screenshots/Screenshot%202025-01-11%20at%208.09.04%E2%80%AFPM.png" alt="AI Assistant Demo" width="800"/>

_The AI-powered assistant providing context-aware help and documentation support._

### Code Playground

<img src="https://github.com/ayushsrivastava55/DocFlow/blob/main/application/screenshots/Screenshot%202025-01-11%20at%208.08.39%E2%80%AFPM.png" alt="Code Playground" width="800"/>

_Interactive code playground with syntax highlighting and real-time execution capabilities._

## 🌟 Key Features

### 1. Interactive Documentation

- **Dynamic Table of Contents**: Auto-generated, clickable navigation
- **Step-by-Step Guides**: Clear, structured learning paths
- **Interactive Flowcharts**: Visual representation of processes using Mermaid.js
- **Code Playgrounds**: Live code editing and execution environment

### 2. AI-Powered Assistance

- **Documentation Assistant**: AI-powered help for understanding documentation
- **Code Assistant**: Intelligent code suggestions and explanations
- **Smart Search**: Context-aware documentation search
- **Natural Language Processing**: Understanding user queries in plain English

### 3. Developer Tools

- **Code Editor**: Syntax highlighting and auto-completion
- **Real-time Preview**: Instant visualization of documentation changes
- **Version Control Integration**: Built-in Git support
- **Multiple Language Support**: Support for various programming languages

### 4. Collaboration Features

- **Community Section**: Share and discuss documentation
- **Progress Tracking**: Monitor learning progress
- **Interactive Feedback**: Real-time user interaction

## Project Structure

```
application/
├── public/                 # Static assets
│   └── favicon.svg
├── src/
│   ├── components/        # React components
│   │   ├── BackToTop.jsx
│   │   ├── CodeAssistant.jsx
│   │   ├── CodeEditor.jsx
│   │   ├── CodePlayground.jsx
│   │   ├── DocAssistant.jsx
│   │   ├── FileUpload.jsx
│   │   ├── FlowChart.jsx
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   └── TableOfContents.jsx
│   ├── context/          # React Context providers
│   │   ├── DocumentationContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/           # Main application pages
│   │   ├── Community.jsx
│   │   ├── Documentation.jsx
│   │   ├── Home.jsx
│   │   └── Progress.jsx
│   ├── services/        # API and service integrations
│   │   ├── aiAssistService.js
│   │   ├── codeAssistService.js
│   │   ├── docAssistantService.js
│   │   └── worqhatService.js
│   ├── App.jsx         # Main application component
│   └── main.jsx       # Application entry point
├── package.json       # Dependencies and scripts
└── vite.config.js    # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A WorqHat API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ayushsrivastava55/DocFlow.git
cd DocFlow/application
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the application directory with your WorqHat API key:

```env
VITE_WORQHAT_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

## Technology Stack

- **Frontend Framework**: React.js with Vite
- **Styling**: Tailwind CSS
- **Code Editor**: CodeMirror
- **Flowcharts**: Mermaid.js
- **AI Integration**: WorqHat API
- **State Management**: React Context
- **UI Components**: Custom components with modern design

## Component Details



1. **CodePlayground**

   - Live code editing environment
   - Syntax highlighting
   - Real-time execution
   - Multiple language support

2. **DocAssistant**

   - AI-powered documentation helper
   - Context-aware responses
   - Natural language understanding
   - Code explanation capabilities

3. **FlowChart**

   - Interactive flowchart creation
   - Mermaid.js integration
   - Real-time preview
   - Export capabilities

4. **TableOfContents**
   - Dynamic navigation generation
   - Auto-updating structure
   - Smooth scroll navigation
   - Collapsible sections

### Services

1. **aiAssistService**

   - Handles AI-related functionalities
   - Manages API calls to WorqHat
   - Processes natural language queries

2. **docAssistantService**
   - Documentation parsing and analysis
   - Content recommendation
   - Search functionality
   - Context management

## WorqHat API Integration

DocFlow leverages the powerful WorqHat AI APIs extensively throughout the application to provide intelligent features and enhance user experience:

### 1. Text Generation API

- **Documentation Assistant**: Uses WorqHat's Text Generation API to provide context-aware responses to user queries about documentation
- **Code Explanation**: Generates human-readable explanations of complex code snippets
- **Error Resolution**: Helps users understand and fix code errors with detailed explanations
- **Model Used**: `aion-v4-nano-160824` for quick and efficient text generation, optimized for resource efficiency

### 2. Code Generation API

- **Code Suggestions**: Provides intelligent code completions and suggestions
- **Code Refactoring**: Helps improve code quality with automated refactoring suggestions
- **Test Case Generation**: Automatically generates test cases for code snippets
- **Model Used**: `aion-v4-nano-160824` with fine-tuning for programming-specific tasks

### 3. Text Processing API

- **Documentation Analysis**: Processes and understands documentation content
- **Smart Search**: Powers the intelligent search functionality with semantic understanding
- **Content Summarization**: Creates concise summaries of documentation sections
- **Model Used**: `aion-v4-nano-160824` optimized for fast and accurate text processing

### 4. Image Generation API
- **Flowchart Visualization**: Enhances flowcharts with auto-generated visual elements
- **Documentation Graphics**: Creates relevant illustrations for documentation
- **Model Used**: `aion-v4-nano-160824` for consistent and contextual image generation

### Why We Chose WorqHat's `aion-v4-nano-160824`

Our platform leverages WorqHat's `aion-v4-nano-160824` model across all AI features because:
- **Resource Efficiency**: Optimized for quick responses while maintaining high quality
- **Fine-tuned Capabilities**: Includes specialized training for programming and documentation tasks
- **Consistent Performance**: Provides reliable results across different types of queries
- **Cost-effective**: Balanced performance and resource usage for production environments

### Advanced Capabilities of AiCon V4

The `aion-v4-nano-160824` model is part of WorqHat's AiCon V4 family, which brings several groundbreaking features:

1. **Multimodal Processing**
   - Processes multiple types of inputs (text, images, videos)
   - Enables comprehensive understanding of context
   - Delivers more accurate and insightful responses
   - Creates a more natural, human-like interaction

2. **Enhanced Context Management**
   - Massive 750K token window
   - 90% recall rate for accurate information retention
   - Advanced retrieval mechanism for near-infinite context
   - Maintains conversation history automatically

3. **Conversation-First Design**
   - Automatic conversation tracking
   - Eliminates need for repeated explanations
   - Maintains context across multiple interactions
   - Focuses on natural dialogue flow

4. **Technical Excellence**
   - Built for production-grade performance
   - Optimized for resource efficiency
   - Seamless integration capabilities
   - Robust error handling and recovery

These capabilities make AiCon V4 particularly well-suited for DocFlow's documentation and assistance features, enabling us to provide:
- More intuitive documentation generation
- Context-aware code assistance
- Intelligent search and retrieval
- Natural conversational interactions

## Security

- Environment variables for sensitive data
- API key protection
- Secure API endpoints
- Input validation and sanitization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## Acknowledgments

- WorqHat for providing the AI capabilities
- The open-source community for various tools and libraries

