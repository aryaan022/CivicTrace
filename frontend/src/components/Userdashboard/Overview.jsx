import React from 'react';

export default function Overview({ totalBudget, activeDisputesCount, haltedProjectsCount, projects }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-white tracking-tight">Audit Overview</h3>
        <p className="text-[11px] text-slate-400 font-medium">Consensus-driven public works tracking under jurisdiction Rampur Panchayat.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Total Allocated Funds</span>
          <span className="text-lg font-black text-white mt-1 block">₹{totalBudget.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Active Audit Disputes</span>
          <span className="text-lg font-black text-amber-400 mt-1 block">{activeDisputesCount} Issues</span>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl border-l-red-500/80 border-l-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Automatic Project Halts</span>
          <span className="text-lg font-black text-red-400 mt-1 block">{haltedProjectsCount} Halted</span>
        </div>
      </div>

      {/* Crucial Concept & 3D Audit Node Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Automatic Halt Rule */}
        <div className="md:col-span-2 bg-slate-950/45 p-4 rounded-xl border border-slate-800/80 flex gap-3.5 items-start">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/15 text-sm shrink-0">⚖️</div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">Panchayat Automatic Halt Protocol</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed font-normal">
              If more than <span className="text-amber-400 font-bold">50% of registered citizens</span> in the Panchayat upvote an active dispute, funding disbursements are automatically halted. This prevents contractors from draining public cash on faulty infrastructure.
            </p>
          </div>
        </div>

        {/* Interactive 3D Holographic Consensus Node Card */}
        <div className="bg-gradient-to-br from-slate-955 to-slate-900 border border-slate-805 rounded-xl p-4.5 flex flex-col justify-between min-h-[240px] relative overflow-hidden group hover:border-blue-500/40 transition-all duration-500 [perspective:1000px]">
          <div className="flex justify-between items-center z-10">
            <span className="text-[8px] font-bold tracking-widest text-slate-550 uppercase">Audit Consensus</span>
            <span className="text-[8px] text-blue-400 font-extrabold uppercase px-1.5 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">Secure Node</span>
          </div>
          
          {/* Glowing Illustration with 3D Hover Tilt Effect */}
          <div className="relative w-full h-[170px] mt-1.5 flex items-center justify-center [transform-style:preserve-3d] group-hover:[transform:rotateX(12deg)_rotateY(-12deg)] transition-transform duration-500 select-none pointer-events-none">
            <img 
              src="/ledger-nodes.png" 
              alt="Consensus Audit Node"
              className="max-h-full max-w-full rounded-lg object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all duration-500 scale-115" 
            />
          </div>

          <div className="text-[9px] text-slate-550 font-bold uppercase tracking-wider text-center mt-3 z-10 transition-colors group-hover:text-blue-400">
            Node Cryptographic Consensus
          </div>
          
          {/* Subtle background glow */}
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/15 transition duration-500 pointer-events-none"></div>
        </div>
      </div>

      {/* Project List Sneak Peek */}
      <div className="border-t border-slate-800/60 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Recent Projects Progress</h4>
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id} className="bg-slate-950/30 border border-slate-850 p-3.5 rounded-xl flex items-center justify-between gap-4 text-xs animate-fadeIn">
              <div>
                <span className="font-bold text-white text-[13px] block leading-tight">{p.title}</span>
                <span className="text-[9px] font-semibold text-slate-400 mt-1 block">Budget: ₹{p.budget.toLocaleString('en-IN')} | Tranches: {p.tranchesReleased}</span>
              </div>
              <span className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wide ${
                p.status === "Active" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                p.status === "Halted" ? "bg-red-500/10 border border-red-500/20 text-red-400" :
                "bg-blue-500/10 border border-blue-500/20 text-blue-400"
              }`}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
