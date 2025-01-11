# Interactive Documentation Platform

A modern platform for interactive documentation with step-by-step guides, flowcharts, and intuitive learning experiences.

## Project Structure
```
.
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── routes.py
│   ├── requirements.txt
│   └── run.py
└── frontend/
    ├── src/
    ├── public/
    └── package.json
```

## Setup Instructions

### Backend Setup
1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a .env file in the backend directory with your Worqhat API key:
   ```
   WORQHAT_API_KEY=your_api_key_here
   ```

4. Run the Flask server:
   ```bash
   python run.py
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Features
- PDF Upload and Processing
- Interactive Documentation Generation
- Flowchart Visualization
- Code Editor Integration
- Progress Tracking
- Interactive Tutorials

## Tech Stack
- Backend: Flask
- Frontend: React with Vite
- Styling: TailwindCSS
- Code Editor: CodeMirror
- APIs: Worqhat (Text Extraction, Generation, Image Generation)
