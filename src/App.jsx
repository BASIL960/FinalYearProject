import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Records from './pages/Records';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <AuthProvider>
      <Router>
        <main className={isDarkMode ? 'dark bg-gray-900 min-h-screen transition-colors duration-300' : 'bg-gray-50 min-h-screen transition-colors duration-300'}>
          <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
              <Route path="/login" element={<Login isDarkMode={isDarkMode} />} />
              <Route path="/register" element={<Register isDarkMode={isDarkMode} />} />
              <Route path="/records" element={<Records isDarkMode={isDarkMode} />} />
            </Routes>
          </div>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;