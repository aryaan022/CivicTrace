import React from 'react';

export default function Sidebar({ user, activeTab, setActiveTab, onLogout, activeDisputesCount }) {
  return (
    <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4">
      
      {/* User Profile Summary */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col items-center text-center shadow-lg">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-md border border-slate-700">
          {user?.name ? user.name[0].toUpperCase() : "C"}
        </div>
        <h4 className="mt-3 font-bold text-white tracking-tight">{user?.name || "Citizen Auditor"}</h4>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">@{user?.username || "citizen"}</span>
        
        <div className="mt-3.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[9px] font-extrabold uppercase tracking-widest">
          {user?.role || "Citizen"}
        </div>

        <div className="w-full border-t border-slate-800/85 my-4"></div>

        <div className="w-full text-left space-y-2 text-[11px] text-slate-400">
          <div>
            <span className="text-slate-500 block font-bold uppercase tracking-wider text-[9px]">Email</span>
            <span className="font-medium text-slate-300 truncate block">{user?.email || "not provided"}</span>
          </div>
          <div>
            <span className="text-slate-550 block font-bold uppercase tracking-wider text-[9px]">Phone</span>
            <span className="font-medium text-slate-300 block">{user?.phone || "not provided"}</span>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="mt-6 w-full py-2 bg-slate-800/80 hover:bg-red-650 hover:text-white border border-slate-700/80 rounded-lg text-xs font-bold text-slate-300 transition-all cursor-pointer"
        >
          LOGOUT PORTAL
        </button>
      </div>

      {/* Tab Menu Navigation */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col gap-1 shadow-md text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors cursor-pointer flex items-center gap-2.5 ${activeTab === 'overview' ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
        >
          📊 Panchayat Overview
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors cursor-pointer flex items-center gap-2.5 ${activeTab === 'projects' ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
        >
          🏗️ Village Projects
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors cursor-pointer flex items-center gap-2.5 ${activeTab === 'disputes' ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
        >
          ⚖️ Audit Disputes ({activeDisputesCount})
        </button>
        <button
          onClick={() => setActiveTab('raise')}
          className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors cursor-pointer flex items-center gap-2.5 ${activeTab === 'raise' ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
        >
          ✍️ Raise Audit Dispute
        </button>
      </div>

    </aside>
  );
}
