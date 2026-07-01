import React from 'react';

export default function Overview({ totalBudget, budgetSpent, registeredCitizensCount, projects, haltedProjectsCount, activeDisputesCount }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-white tracking-tight">Sarpanch Administration Portal</h3>
        <p className="text-[11px] text-slate-400 font-medium">Manage and submit proof of work for development projects in Rampur Panchayat.</p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Allocated Village Budget</span>
          <span className="text-lg font-black text-white mt-1 block">₹{totalBudget.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Registered Citizen Auditors</span>
          <span className="text-lg font-black text-emerald-400 mt-1 block">{registeredCitizensCount} Citizens</span>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl border-l-amber-500/80 border-l-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Disputes Active / Halted</span>
          <span className="text-lg font-black text-amber-400 mt-1 block">{activeDisputesCount} Issues / {haltedProjectsCount} Halted</span>
        </div>
      </div>

      {/* Consensus Math Explanation Card */}
      <div className="bg-slate-950/40 p-4.5 rounded-xl border border-slate-800 flex gap-3.5 items-start">
        <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/15 text-sm shrink-0">📈</div>
        <div>
          <h4 className="text-xs font-bold text-white mb-1">Citizen Consensus Quorum Checklist</h4>
          <p className="text-[10px] text-slate-400 leading-relaxed font-normal">
            Based on your village's registered auditor pool of <strong className="text-emerald-400">{registeredCitizensCount} citizens</strong>, any dispute that receives more than <strong className="text-amber-400">{Math.ceil(registeredCitizensCount * 0.5) || 1} upvotes</strong> will immediately activate the **Halt Protocol** and block contractor tranches. Resolve disputes promptly through your District Admin to restore project flow.
          </p>
        </div>
      </div>

      {/* Sarpanch Project Overview */}
      <div className="border-t border-slate-800/60 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 mb-3.5">Active Project Ledgers</h4>
        <div className="space-y-3.5">
          {projects.map(p => {
            const completedMilestones = p.milestones.filter(m => m.status === "Disbursed").length;
            const totalMilestones = p.milestones.length;
            const percentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

            return (
              <div key={p.id} className="bg-slate-950/30 border border-slate-850 p-4 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white text-[13px] block leading-tight">{p.title}</span>
                    <span className="text-[9.5px] text-slate-500 mt-1 block">Contractor: {p.contractorName}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${
                    p.status === "Active" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                    p.status === "Halted" ? "bg-red-500/10 border border-red-500/20 text-red-400" :
                    "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                  }`}>
                    {p.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    <span>Milestones Completed: {completedMilestones}/{totalMilestones}</span>
                    <span>{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850/80">
                    <div 
                      className={`h-full rounded-full transition-all duration-550 ${p.status === "Halted" ? "bg-red-500/60" : "bg-emerald-500"}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
