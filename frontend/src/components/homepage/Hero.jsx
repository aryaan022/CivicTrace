import React from 'react';

export default function Hero({ onOpenRegister, onOpenLogin }) {
  return (
    <section id="overview" className="bg-gradient-to-b from-slate-955 via-slate-900/60 to-slate-955 border-b border-slate-800/60 py-20 md:py-24 px-6 overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left Column: Mission statement and calls to action */}
        <div className="lg:col-span-7 text-left">
          <span className="bg-blue-950/60 text-blue-400 border border-blue-900/50 text-[10px] px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Verifiable Panchayat Ledger Platform
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5 leading-[1.15] text-white">
            Democratizing Public Funds Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Citizen-Consent Audits</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 mb-8 leading-relaxed font-normal max-w-xl">
            CivicTrace locks Panchayat development funds in smart milestone tranches. Funds are disbursed to execution units only when verified local village citizens audit geotagged photo updates and reach a majority consensus.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className="bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg transition duration-200 cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25"
              onClick={onOpenRegister}
            >
              Register as Citizen
            </button>
            <button 
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg transition duration-200 cursor-pointer shadow-sm"
              onClick={onOpenLogin}
            >
              Access Portal Login
            </button>
          </div>
        </div>

        {/* Right Column: 3D Floating Ledger Stack */}
        <div className="lg:col-span-5 flex justify-center items-center h-[340px] relative z-10">
          <div className="perspective-container relative w-[320px] h-[240px]">
            
            {/* Back Card: Budget Allocation */}
            <div className="animate-3d-back absolute top-0 left-0 w-[280px] bg-[#0f172a] border border-slate-800 rounded-2xl p-5 text-left transition-transform duration-300 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Panchayat Ledger Node</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1.5">Link Road Construction</h4>
              <div className="text-[10px] text-slate-400 font-semibold mb-3">₹8,00,000 Budget Allocated</div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-amber-500 h-full w-[50%]"></div>
              </div>
            </div>

            {/* Middle Card: Cryptographic Security / Identity */}
            <div className="animate-3d-mid absolute top-0 left-0 w-[280px] bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-5 text-left transition-transform duration-300 shadow-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Identity Cryptography</span>
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xs font-bold text-white mb-2">SHA-256 Deterministic Hash</h4>
              <code className="block font-mono text-[9px] text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800 break-all leading-normal">
                Peppered: 7f83a84f3c...
              </code>
            </div>

            {/* Front Card: Milestone Verified */}
            <div className="animate-3d-front absolute top-0 left-0 w-[280px] bg-[#1e293b] border border-slate-700 rounded-2xl p-5 text-left transition-transform duration-300 shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Consensus Audited</span>
                <span className="text-[8px] font-bold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-900/60 px-1.5 py-0.5 rounded">Verified</span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1.5">Milestone 2 Completed</h4>
              <div className="text-[10px] text-slate-405 mb-3 font-semibold">Tranche 2 Disbursed: ₹2,40,000</div>
              <div className="flex items-center gap-1.5 text-[9.5px] text-emerald-400 font-bold bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/40">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                98.4% Public Consensus Approval
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
