import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-green-600 dark:text-green-500">
              DocFlow
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500">
              Home
            </Link>
            <Link to="/documentation" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500">
              Documentation
            </Link>
            <Link to="/progress" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500">
              My Progress
            </Link>
            <Link to="/community" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500">
              Community
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>

            {/* User Profile */}
            <div className="relative">
              <button className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                U
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
