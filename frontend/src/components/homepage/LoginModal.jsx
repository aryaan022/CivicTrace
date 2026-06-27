import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm p-6 shadow-2xl rounded-2xl text-left relative">
        
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-slate-800/80 mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Portal Access Login</h3>
          <span className="text-[9px] text-slate-500 font-bold block mt-0.5 uppercase tracking-wide">Enter admin or auditor credentials</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
            <input 
              type="email" 
              className="w-full px-3.5 py-2.5 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-slate-100 font-medium placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 transition duration-200" 
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
            <input 
              type="password" 
              className="w-full px-3.5 py-2.5 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-slate-100 font-medium placeholder-slate-655 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 transition duration-200" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="bg-slate-950/55 p-2.5 rounded-lg border border-slate-800/60 flex items-start gap-2 mb-5">
            <svg className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[9px] text-slate-400 leading-relaxed">
              Authenticates credentials via the secure <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-400 border border-slate-800 font-bold">POST /api/auth/login</code> server endpoint.
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800/80">
            <button 
              type="button" 
              className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold cursor-pointer transition duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer shadow-md shadow-blue-500/10 transition duration-200"
            >
              Login
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
