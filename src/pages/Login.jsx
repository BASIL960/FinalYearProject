import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = ({ isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className={`flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Logo Icon */}
        <div className="mx-auto h-12 w-12 text-indigo-600">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
             <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 12c0 5.082 2.956 9.565 7.321 11.74a.75.75 0 00.675-.008C15.013 21.49 18 16.712 18 11.373c0-1.89-.387-3.682-1.09-5.32l1.656-1.657a.75.75 0 00.082-.976l-5.334-5.334a.75.75 0 00-.798-.077zM4.659 11.373c0-2.316.732-4.47 1.986-6.242l8.038 8.038A9.761 9.761 0 014.66 11.373zm9.645-5.91l-6.42-6.42 2.766-2.767 3.654 3.654v5.533z" clipRule="evenodd" />
           </svg>
        </div>
        <h2 className={`mt-5 text-center text-2xl font-bold leading-9 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Sign in to your account
        </h2>
      </div>

      <div className={`mt-10 sm:mx-auto sm:w-full sm:max-w-sm p-8 rounded-xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className={`block text-sm font-medium leading-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full rounded-md border-0 py-2.5 px-3 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-colors
                ${isDarkMode 
                  ? 'bg-gray-700 text-white ring-gray-600 placeholder:text-gray-400 focus:ring-indigo-500' 
                  : 'bg-white text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'}`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className={`block text-sm font-medium leading-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full rounded-md border-0 py-2.5 px-3 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-colors
                ${isDarkMode 
                  ? 'bg-gray-700 text-white ring-gray-600 placeholder:text-gray-400 focus:ring-indigo-500' 
                  : 'bg-white text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'}`}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className={`mt-10 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Not a member?{' '}
          <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            <b>register</b>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;