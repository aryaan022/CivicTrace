import React from 'react';

export default function Navbar({ onOpenLogin, onOpenRegister, user, onLogout }) {
  return (
    <header className="w-full flex flex-col shrink-0 sticky top-0 z-40">
      {/* Subtle National Pride Ribbon (Top Border) */}
      <div className="h-[4px] w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]"></div> {/* Saffron */}
        <div className="h-full w-1/3 bg-white"></div>    {/* White */}
        <div className="h-full w-1/3 bg-[#138808]"></div> {/* Green */}
      </div>

      {/* Official Government Top Banner */}
      <div className="bg-slate-955/90 backdrop-blur-sm text-slate-400 text-[10px] py-2 px-6 flex justify-between items-center border-b border-slate-800/60 font-semibold tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>OFFICIAL LEDGER SYSTEM: PUBLIC INFRASTRUCTURE REGISTRY</span>
        </div>
        <span className="hidden sm:inline text-slate-500">Ministry of Panchayati Raj / State Auditing Console</span>
      </div>

      {/* Main Navigation bar with Glassmorphism */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/85 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700/80 shadow-md">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <span className="font-black text-white tracking-tight text-lg block leading-none">Civic<span className="text-blue-400">Trace</span></span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 block">Geotagged consensus audit</span>
          </div>
        </div>

        {!user && (
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-400">
            <a href="#overview" className="hover:text-blue-400 transition-colors">Overview</a>
            <a href="#process" className="hover:text-blue-400 transition-colors">Audit Pipeline</a>
            <a href="#security" className="hover:text-blue-400 transition-colors">Security Architecture</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3.5 animate-fadeIn">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[11px] font-bold text-white block">@{user.username}</span>
                <span className="text-[9px] text-slate-550 font-bold block uppercase tracking-wider">{user.role}</span>
              </div>
              <button 
                className="text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-4 py-2 rounded-lg transition duration-200 cursor-pointer shadow-sm"
                onClick={onLogout}
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <>
              <button 
                className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-650 px-4.5 py-2 rounded-lg transition duration-200 cursor-pointer shadow-sm"
                onClick={onOpenLogin}
              >
                SIGN IN
              </button>
              <button 
                className="text-xs font-bold text-slate-955 bg-blue-500 hover:bg-blue-400 px-4.5 py-2 rounded-lg transition duration-200 cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
                onClick={onOpenRegister}
              >
                REGISTER
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
