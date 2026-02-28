import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = ({ isDarkMode }) => {
  // Common Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // User Type
  const [userType, setUserType] = useState('individual');

  // Individual Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  // Organization Fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { onLoginSuccess } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const baseData = { username, email, password, user_type: userType };
    let finalData;

    if (userType === 'individual') {
      finalData = { ...baseData, first_name: firstName, last_name: lastName, job_title: jobTitle };
    } else {
      finalData = { ...baseData, company_name: companyName, industry, location };
    }

    try {
      const data = await register(finalData);
      onLoginSuccess(data.user);
      navigate('/');
    } catch (err) {
      // Flatten possible error shapes from DRF
      const firstError =
        err?.detail ||
        err?.username?.[0] ||
        err?.email?.[0] ||
        err?.password?.[0] ||
        err?.non_field_errors?.[0] ||
        err?.message ||
        'Registration failed. Please check your details.';
      setError(firstError);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper styles
  const labelClass = `block text-sm font-medium leading-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`;
  const inputClass = `block w-full rounded-md border-0 py-2.5 px-3 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-colors
    ${isDarkMode
      ? 'bg-gray-700 text-white ring-gray-600 placeholder:text-gray-400 focus:ring-indigo-500'
      : 'bg-white text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'}`;

  return (
    <div className={`flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto h-12 w-12 text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 12c0 5.082 2.956 9.565 7.321 11.74a.75.75 0 00.675-.008C15.013 21.49 18 16.712 18 11.373c0-1.89-.387-3.682-1.09-5.32l1.656-1.657a.75.75 0 00.082-.976l-5.334-5.334a.75.75 0 00-.798-.077zM4.659 11.373c0-2.316.732-4.47 1.986-6.242l8.038 8.038A9.761 9.761 0 014.66 11.373zm9.645-5.91l-6.42-6.42 2.766-2.767 3.654 3.654v5.533z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className={`mt-5 text-center text-2xl font-bold leading-9 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Create a new account
        </h2>
      </div>

      <div className={`mt-10 sm:mx-auto sm:w-full sm:max-w-sm p-8 rounded-xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Error Banner */}
          {error && (
            <div className="rounded-md bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* --- Common Fields --- */}
          <div>
            <label htmlFor="username" className={labelClass}>User Name</label>
            <div className="mt-2">
              <input id="username" name="username" type="text" required
                value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email address</label>
            <div className="mt-2">
              <input id="email" name="email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <div className="mt-2">
              <input id="password" name="password" type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* --- User Type Selector --- */}
          <div>
            <label className={`block text-sm font-medium leading-6 mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              I am registering as:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setUserType('individual')}
                className={`py-2 px-4 rounded-md text-sm font-semibold transition-all border
                  ${userType === 'individual'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : `bg-transparent border-gray-300 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}`}>
                Individual
              </button>
              <button type="button" onClick={() => setUserType('organization')}
                className={`py-2 px-4 rounded-md text-sm font-semibold transition-all border
                  ${userType === 'organization'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : `bg-transparent border-gray-300 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}`}>
                Organization
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

          {/* --- Conditional Fields --- */}
          {userType === 'individual' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={labelClass}>First Name</label>
                  <div className="mt-2">
                    <input id="firstName" type="text" required
                      value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass}>Last Name</label>
                  <div className="mt-2">
                    <input id="lastName" type="text" required
                      value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="jobTitle" className={labelClass}>Job Title</label>
                <div className="mt-2">
                  <input id="jobTitle" type="text"
                    value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className={inputClass} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="companyName" className={labelClass}>Company Name</label>
                <div className="mt-2">
                  <input id="companyName" type="text" required
                    value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="industry" className={labelClass}>Industry</label>
                <div className="mt-2">
                  <input id="industry" type="text"
                    value={industry} onChange={(e) => setIndustry(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="location" className={labelClass}>Location</label>
                <div className="mt-2">
                  <input id="location" type="text"
                    value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
                </div>
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Creating account…
                </>
              ) : (
                `Sign Up as ${userType === 'individual' ? 'Individual' : 'Organization'}`
              )}
            </button>
          </div>
        </form>

        <p className={`mt-10 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;