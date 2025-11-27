import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// استيراد المكونات
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // تأثير تغيير كلاس الـ HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // دالة لتبديل الوضع
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      {/* نمرر isDarkMode إلى الـ main للتحكم في الخلفية العامة 
      */}
      <main className={isDarkMode ? 'dark bg-gray-900 min-h-screen transition-colors duration-300' : 'bg-gray-50 min-h-screen transition-colors duration-300'}>
        
        {/* نمرر الدوال والقيم اللازمة للناف بار */}
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

        <div className="container mx-auto">
          <Routes>
            {/* نمرر isDarkMode للصفحة الرئيسية لكي تستخدمه في تنسيق النصوص والحدود */}
            <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
            <Route path="/login" element={<Login isDarkMode={isDarkMode} />} />
            <Route path="/register" element={<Register isDarkMode={isDarkMode} />} />
          </Routes>
        </div>
        
      </main>
    </Router>
  );
};

export default App;