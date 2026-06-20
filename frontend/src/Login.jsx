import React, { useState } from 'react';

export default function Login({ setCurrentPage, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setSuccessMessage('Login successful! Redirecting...');
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        
        setTimeout(() => {
          setCurrentPage('home');
        }, 1200);
      } else {
        setErrorMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMessage('Failed to connect to the server. Is it running?');
    }
  };

  return (
    <div className="font-sans antialiased bg-gray-50 text-brand-black min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 mb-6 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="w-6 h-6 bg-brand-black rounded-sm"></div>
          <span className="text-2xl font-bold tracking-tight">CivicTrace</span>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign In</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your local civic audit dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-xl sm:px-10">
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm">
              {successMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1">
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-brand-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <button onClick={() => setCurrentPage('register')} className="font-medium text-brand-blue hover:text-blue-700">Register</button>
          </div>
          
          <div className="mt-4 text-center">
            <button 
              onClick={() => setCurrentPage('home')}
              className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
