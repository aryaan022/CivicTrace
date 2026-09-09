import React from 'react';

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  const navItems = [
    { id: 'overview', label: 'Telemetry Overview', icon: '📊' },
    { id: 'projects', label: 'Project Registry', icon: '🏗️' },
    { id: 'disputes', label: 'Dispute Arbitration', icon: '⚖️' },
    { id: 'milestones', label: 'Milestone Releases', icon: '💳' },
    { id: 'ai-risk', label: 'AI Risk & Anomaly Center', icon: '🤖' }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between shrink-0">
      <div>
        {/* Admin Profile Badge */}
        <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-sm shadow-inner">
            🏛️
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">{user?.name || 'District Admin'}</h2>
            <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
              District Magistrate Office
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-5 mt-5 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-bold transition duration-200 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Disconnect Session
        </button>
      </div>
    </aside>
  );
}
