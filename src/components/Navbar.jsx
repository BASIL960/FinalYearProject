import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  return (
    <nav>
      <header className={`flex items-center justify-between px-6 py-3 md:py-4 shadow max-w-5xl rounded-full mx-auto w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Link to="/">
          <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className='purple' style={{ color: '#4f39f6' }}>Lytrex</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            /* ---- Logged-in state ---- */
            <>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {user.username}
              </span>
              <Link
                to="/records"
                className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Records
              </Link>
              <button
                onClick={onLogout}
                className="text-sm font-semibold px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            /* ---- Guest state ---- */
            <>
              <Link to="/login" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Login</Link>
              <Link to="/register" className="text-sm font-semibold px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
                Register
              </Link>
            </>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>
    </nav>
  );
};

export default Navbar;