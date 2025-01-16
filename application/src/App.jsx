import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Documentation from './pages/Documentation';
import Progress from './pages/Progress';
import Community from './pages/Community';
import Quiz from './pages/Quiz';
import { ThemeProvider } from './context/ThemeContext';
import { DocumentationProvider } from './context/DocumentationContext';

function App() {
  return (
    <ThemeProvider>
      <DocumentationProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/community" element={<Community />} />
              </Routes>
            </main>
          </div>
        </Router>
      </DocumentationProvider>
    </ThemeProvider>
  );
}

export default App;
