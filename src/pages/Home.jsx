import React, { useState } from 'react';
// تأكد من أن المسار للصورة صحيح
import pdfIcon from '../assets/pdf-128.ico'; 

const Home = ({ isDarkMode }) => {
  const [framework, setFramework] = useState('framework1');
  const [file, setFile] = useState(null);
  const [reportType, setReportType] = useState('summary'); // 'summary' or 'detailed'

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      alert(`File "${file.name}" selected!\nReport Type: ${reportType}`);
    } else {
      alert('Please select a file.');
    }
  };

  // دالة مساعدة لتحديد ستايل خيار التقرير (لتبسيط كود الـ JSX)
  const getRadioStyle = (type) => {
    const isSelected = reportType === type;
    
    // الألوان في حالة الوضع الليلي
    if (isDarkMode) {
      if (isSelected) return 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-500/20';
      return 'border-gray-600 bg-gray-800 hover:bg-gray-700';
    }
    
    // الألوان في حالة الوضع النهاري
    if (isSelected) return 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50';
    return 'border-gray-300 bg-white hover:bg-gray-50';
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 text-center">
      <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome to Smart Compliance</h1>
      <p className={`text-lg md:text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Your all-in-one solution for managing compliance with ease and efficiency.
      </p>
      
      <form className="max-w-md mx-auto" method="post" onSubmit={handleSubmit}>
        {/* Toggle buttons for Framework */}
        <div className={`mt-10 flex justify-center rounded-full p-1.5 space-x-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          {['framework1', 'framework2', 'framework3'].map((fw, i) => (
            <button
              key={fw}
              onClick={() => setFramework(fw)}
              type="button"
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                framework === fw
                  ? 'bg-indigo-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {`Framework ${i + 1}`}
            </button>
          ))}
        </div>

        <p className={`mt-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Selected: <span className="text-indigo-600">{framework}</span>
        </p>

        {/* Upload Box */}
        <div className="flex justify-center mt-8">
          <div className={`w-full`}>
            <div className={`flex justify-center rounded-lg border border-dashed px-6 py-10 transition-colors
              ${isDarkMode ? 'border-white/25 bg-gray-800' : 'border-gray-900/25 bg-white'}`}>
              <div className="text-center">
                <img src={pdfIcon} alt="Upload Icon" className="mx-auto mb-4 h-12 w-12" />
                <div className={`mt-4 flex text-sm/6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} justify-center`}>
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      type="file"
                      name="file-upload"
                      className="sr-only"
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">{isDarkMode ? <span className="text-gray-300">or drag and drop</span> : 'or drag and drop'}</p>
                </div>
                <p className={`text-xs/5 mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>PDF up to 10MB</p>
                {file && (
                  <p className={`mt-2 text-sm ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                    Selected file: {file.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Report Type Options (Updated for Dark Mode) */}
        <div className="mt-8">
          <p className={`text-sm font-medium mb-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Report Type:</p>
          <div className="grid grid-cols-2 gap-4">
            
            {/* Summary Option */}
            <label 
              className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-all ${getRadioStyle('summary')}`}
            >
              <input 
                type="radio" 
                name="report-type" 
                value="summary" 
                className="sr-only" 
                checked={reportType === 'summary'}
                onChange={() => setReportType('summary')}
              />
              <span className="flex flex-col text-left">
                <span className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Summary</span>
                <span className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Brief overview & score</span>
              </span>
            </label>

            {/* Detailed Option */}
            <label 
              className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-all ${getRadioStyle('detailed')}`}
            >
              <input 
                type="radio" 
                name="report-type" 
                value="detailed" 
                className="sr-only" 
                checked={reportType === 'detailed'}
                onChange={() => setReportType('detailed')}
              />
              <span className="flex flex-col text-left">
                <span className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Detailed</span>
                <span className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Full analysis & steps</span>
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="px-8 py-2 rounded-full font-medium transition-all shadow w-full md:w-auto bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Generate Report
          </button>
        </div>
      </form>
    </section>
  );
};

export default Home;