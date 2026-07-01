import React from 'react';

export default function DisputesList({ disputes, registeredCitizensCount }) {
  const activeDisputes = disputes.filter(d => d.status !== "Resolved");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-white tracking-tight">Active Auditing Disputes</h3>
        <p className="text-[11px] text-slate-400 font-medium">Review quality and coordinate compliance issues raised by citizen auditors below.</p>
      </div>

      {activeDisputes.length === 0 ? (
        <div className="bg-slate-950/40 border border-slate-800 p-8 rounded-xl text-center text-slate-500 text-xs font-semibold">
          🎉 No active disputes in your Gram Panchayat. Project ledger flow is clear.
        </div>
      ) : (
        <div className="space-y-4">
          {activeDisputes.map(d => {
            const upvotesCount = d.upvotes || 0;
            const ratio = registeredCitizensCount > 0 ? (upvotesCount / registeredCitizensCount) * 100 : 0;
            const isDanger = ratio >= 45; // nearing halt threshold

            return (
              <div key={d.id} className="bg-slate-950/45 border border-slate-800 p-4.5 rounded-xl space-y-3.5 animate-fadeIn">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">{d.projectTitle}</span>
                    <h4 className="text-xs font-bold text-white leading-tight">{d.title}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest shrink-0 ${
                    d.status === "Resolved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm shadow-amber-500/5 animate-pulse"
                  }`}>
                    {d.status}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed font-normal">{d.description}</p>
                
                {/* Consensus Meter */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    <span>Citizen Upvote Ratio: {upvotesCount}/{registeredCitizensCount} Votes</span>
                    <span className={isDanger ? "text-red-400" : "text-amber-400"}>{ratio.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850">
                    <div 
                      className={`h-full rounded-full transition-all ${isDanger ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} 
                      style={{ width: `${ratio}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-900 flex-wrap gap-2 text-[10px] text-slate-550 font-bold uppercase tracking-wider">
                  <div>
                    <span>Reported by: <strong className="text-slate-400">@{d.citizenName}</strong></span>
                  </div>

                  <div className="text-[9px] text-slate-500 flex items-center gap-1.5 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Contact District Admin to mark resolved after site inspection
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
