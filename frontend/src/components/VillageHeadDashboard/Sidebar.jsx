import React from 'react';

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4">
      
      {/* Sarpanch Profile Summary */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col items-center text-center shadow-lg">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-650 flex items-center justify-center font-black text-white text-xl shadow-md border border-slate-700">
          {user?.name ? user.name[0].toUpperCase() : "S"}
        </div>
        <h4 className="mt-3 font-bold text-white tracking-tight">{user?.name || "Village Head"}</h4>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">@{user?.username || "sarpanch"}</span>
        
        <div className="mt-3.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-extrabold uppercase tracking-widest">
          {user?.role || "Village Head"}
        </div>

        <div className="w-full border-t border-slate-800/85 my-4"></div>

        <div className="w-full text-left space-y-2 text-[11px] text-slate-400">
          <div>
            <span className="text-slate-500 block font-bold uppercase tracking-wider text-[9px]">Email</span>
            <span className="font-medium text-slate-300 truncate block">{user?.email || "not provided"}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-bold uppercase tracking-wider text-[9px]">Phone</span>
            <span className="font-medium text-slate-300 block">{user?.phone || "not provided"}</span>
          </div>
          <div>
            <span className="text-slate-550 block font-bold uppercase tracking-wider text-[9px]">Jurisdiction</span>
            <span className="font-medium text-slate-200 block">Rampur Panchayat</span>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="mt-6 w-full py-2 bg-slate-800/80 hover:bg-red-600 hover:text-white border border-slate-700/80 rounded-lg text-xs font-bold text-slate-300 transition-all cursor-pointer"
        >
          LOGOUT PORTAL
        </button>
      </div>

      {/* Tab Menu Navigation */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col gap-1 shadow-md text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors cursor-pointer flex items-center gap-2.5 ${activeTab === 'overview' ? 'bg-emerald-550 text-slate-950 shadow-md shadow-emerald-500/10 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
        >
          📊 Sarpanch Overview
        </button>
        <button
          onClick={() => setActiveTab('proofs')}
          className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors cursor-pointer flex items-center gap-2.5 ${activeTab === 'proofs' ? 'bg-emerald-550 text-slate-950 shadow-md shadow-emerald-500/10 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
        >
          📤 Upload Progress Proof
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors cursor-pointer flex items-center gap-2.5 ${activeTab === 'disputes' ? 'bg-emerald-550 text-slate-950 shadow-md shadow-emerald-500/10 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
        >
          ⚖️ Active Village Disputes
        </button>
      </div>

    </aside>
  );
}
