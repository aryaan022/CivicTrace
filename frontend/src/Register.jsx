import React, { useState, useEffect } from 'react';

export default function Register({ setCurrentPage }) {
  const [villages, setVillages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    aadhaarNumber: '',
    villageId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    
    // Fetch jurisdictions from backend API
    fetch('http://localhost:3000/api/villages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVillages(data.villages);
        } else {
          setMessage({ type: 'error', text: data.message || 'Failed to load jurisdictions.' });
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage({ type: 'error', text: 'Error connecting to the backend. Is the server running?' });
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setMessage({ type: 'success', text: 'Account registered successfully!' });
        setTimeout(() => {
          setCurrentPage('login');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed.' });
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="font-sans antialiased bg-gray-50 text-brand-black min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 mb-6 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="w-6 h-6 bg-brand-black rounded-sm"></div>
          <span className="text-2xl font-bold tracking-tight">CivicTrace</span>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Register Entity</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join your local jurisdiction to audit public infrastructure.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-xl sm:px-10">
          
          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-md p-4 flex gap-3">
            <svg className="h-5 w-5 text-brand-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>System Integrity Notice:</strong> Your Aadhaar hash and selected jurisdiction are immutable. Once registered, this assignment is permanently locked.
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-md border text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Legal Name</label>
              <div className="mt-1">
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1">
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700">Aadhaar Number (12 Digits)</label>
              <div className="mt-1">
                <input 
                  id="aadhaarNumber" 
                  name="aadhaarNumber" 
                  type="text" 
                  minLength="12" 
                  maxLength="12" 
                  required 
                  placeholder="XXXX XXXX XXXX"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="villageId" className="block text-sm font-medium text-gray-700">Select Jurisdiction (Village/Ward)</label>
              <div className="mt-1">
                <select 
                  id="villageId" 
                  name="villageId" 
                  required 
                  value={formData.villageId}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
                >
                  <option value="" disabled>-- Select your area --</option>
                  {villages.length > 0 ? (
                    villages.map((village) => (
                      <option key={village._id} value={village._id}>
                        {village.name} ({village.district})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No jurisdictions available.</option>
                  )}
                </select>
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
                  value={formData.password}
                  onChange={handleChange}
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
                {loading ? 'Registering...' : 'Register Account'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <button onClick={() => setCurrentPage('login')} className="font-medium text-brand-blue hover:text-blue-700">Sign in</button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
