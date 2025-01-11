# DocFlow - Interactive Documentation Platform

DocFlow is a modern, feature-rich documentation platform that combines interactive learning experiences with AI-powered assistance. It provides an intuitive interface for creating, managing, and exploring documentation with features like interactive flowcharts, code playgrounds, and AI-assisted documentation.

## 📸 Project Screenshots

### Homepage & Landing
![DocFlow Homepage](./application/screenshots/Screenshot%202025-01-11%20at%208.07.44%20PM.png)
*The modern and intuitive landing page of DocFlow, showcasing key features and easy navigation.*

### Documentation Interface
![Documentation Interface](./application/screenshots/Screenshot%202025-01-11%20at%208.08.24%20PM.png)
*Our comprehensive documentation interface with dynamic table of contents and interactive content.*

### AI Assistant Integration
![AI Assistant Demo](./application/screenshots/Screenshot%202025-01-11%20at%208.09.04%20PM.png)
*The AI-powered assistant providing context-aware help and documentation support.*

### Code Playground
![Code Playground]()(./application/screenshots/Screenshot%202025-01-11%20at%208.08.39%20PM.png)
*Interactive code playground with syntax highlighting and real-time execution capabilities.*

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

### Core Components

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
- **Model Used**: `text-davinci-003` for high-quality, contextual responses

### 2. Code Generation API
- **Code Suggestions**: Provides intelligent code completions and suggestions
- **Code Refactoring**: Helps improve code quality with automated refactoring suggestions
- **Test Case Generation**: Automatically generates test cases for code snippets
- **Model Used**: `code-davinci-002` for accurate and context-aware code generation

### 3. Text Processing API
- **Documentation Analysis**: Processes and understands documentation content
- **Smart Search**: Powers the intelligent search functionality with semantic understanding
- **Content Summarization**: Creates concise summaries of documentation sections
- **Model Used**: `text-curie-001` for efficient text processing



### Key Benefits of WorqHat Integration

1. **Enhanced User Experience**
   - Real-time AI assistance
   - Context-aware responses
   - Natural language interaction

2. **Improved Documentation Quality**
   - Automated content enhancement
   - Consistent formatting
   - Error detection and correction

3. **Development Efficiency**
   - Faster code writing with suggestions
   - Automated documentation generation
   - Quick error resolution

4. **Learning Enhancement**
   - Interactive learning experience
   - Personalized explanations
   - Adaptive content delivery



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
- All contributors who have helped shape this project
