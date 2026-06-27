import React from 'react';

export default function DisputesList({ disputes, handleUpvote }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-white tracking-tight">Active Audit Disputes</h3>
        <p className="text-[11px] text-slate-400 font-medium">Upvote issues to trigger automatic halt checks or file a complaint below.</p>
      </div>

      <div className="space-y-4">
        {disputes.map(d => (
          <div key={d.id} className="bg-slate-950/45 border border-slate-800 p-4.5 rounded-xl space-y-3.5 animate-fadeIn">
            <div className="flex justify-between items-start gap-3">
              <div>
                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-0.5">{d.projectTitle}</span>
                <h4 className="text-xs font-bold text-white leading-tight">{d.title}</h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest shrink-0 ${
                d.status === "Resolved" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                "bg-amber-500/10 border border-amber-500/20 text-amber-400"
              }`}>
                {d.status}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed font-normal">{d.description}</p>
            
            <div className="flex justify-between items-center pt-2.5 border-t border-slate-900 flex-wrap gap-2 text-[10px] text-slate-500">
              <div>
                <span>Reported by: <strong className="text-slate-400">@{d.citizenName}</strong></span>
              </div>
              
              {d.status !== "Resolved" && (
                <button 
                  onClick={() => handleUpvote(d.id)}
                  className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider transition duration-200 cursor-pointer flex items-center gap-1.5 ${
                    d.hasVoted 
                      ? 'bg-blue-500 border-blue-500 text-slate-950 hover:bg-blue-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  ▲ {d.hasVoted ? 'Voted' : 'Upvote Issue'} ({d.upvotes})
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
