import './App.css'
import { useEffect, useState } from 'react'
import pdfIcon from './assets/pdf-128.ico';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [framework, setFramework] = useState('framework1');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      // Save file logic here (for demo, just alert file name)
      alert(`File "${file.name}" selected!`);
    } else {
      alert('Please select a file.');
    }
  };

  return (
    <main className={isDarkMode ? 'dark bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'}>
      <nav>
        <header className={`flex items-center justify-between px-6 py-3 md:py-4 shadow max-w-5xl rounded-full mx-auto w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <a href="https://prebuiltui.com">
            <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><span className='purple'>Smart</span> Compliance</span>
          </a>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
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
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome to Smart Compliance</h1>
        <p className={`text-lg md:text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Your all-in-one solution for managing compliance with ease and efficiency.
        </p>
        <form className="max-w-md mx-auto" method="post" onSubmit={handleSubmit}>
          {/* Toggle buttons */}
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
          {/* Centered upload box */}
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
          {/* Submit button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className={`px-8 py-2 rounded-full font-medium transition-all shadow
                ${isDarkMode
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default App
