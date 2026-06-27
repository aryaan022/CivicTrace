import React from 'react';

export default function ProjectsList({ projects }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-white tracking-tight">Panchayat Infrastructure Projects</h3>
        <p className="text-[11px] text-slate-400 font-medium">Verify progress, milestone tranches, and contractor specifications below.</p>
      </div>

      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="bg-slate-950/40 border border-slate-800 p-4.5 rounded-xl space-y-3 shadow-sm hover:border-slate-700 transition duration-200 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="text-sm font-bold text-white">{p.title}</h4>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                p.status === "Active" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                p.status === "Halted" ? "bg-red-500/10 border border-red-500/20 text-red-400 shadow shadow-red-500/5 animate-pulse" :
                "bg-blue-500/10 border border-blue-500/20 text-blue-400"
              }`}>
                {p.status}
              </span>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed font-normal">{p.description}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/50 p-2.5 rounded-lg border border-slate-850/80 text-[10px]">
              <div>
                <span className="text-slate-500 block font-bold uppercase tracking-wider text-[8px]">Total Budget</span>
                <span className="font-extrabold text-slate-200">₹{p.budget.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-bold uppercase tracking-wider text-[8px]">Disbursed Tranches</span>
                <span className="font-extrabold text-slate-200">{p.tranchesReleased}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-bold uppercase tracking-wider text-[8px]">Raised Disputes</span>
                <span className="font-extrabold text-slate-200">{p.disputesCount} Issues</span>
              </div>
              <div>
                <span className="text-slate-500 block font-bold uppercase tracking-wider text-[8px]">Citizen Votes</span>
                <span className="font-extrabold text-slate-200">{p.totalVotes} Votes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
