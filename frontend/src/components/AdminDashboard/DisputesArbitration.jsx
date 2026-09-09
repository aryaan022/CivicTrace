import React from 'react';

export default function DisputesArbitration({ disputes, onResolveDispute }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">Citizen Grievance Arbitration</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Inspect audit disputes, monitor community consensus upvote velocity, and execute administrative resolutions.
        </p>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {disputes.map(dispute => {
          const project = dispute.project;
          const village = project?.village;
          const totalCitizens = village?.registeredCitizensCount || 10;
          const upvotesCount = dispute.upvotes?.length || (Array.isArray(dispute.upvotes) ? dispute.upvotes.length : 0);
          const haltRatio = totalCitizens > 0 ? (upvotesCount / totalCitizens) : 0;
          const isHalted = haltRatio > 0.5 || project?.status === 'Halted';
          const isResolved = dispute.status === 'Resolved';

          return (
            <div 
              key={dispute._id || dispute.id}
              className={`p-5 rounded-2xl border transition duration-200 ${
                isResolved
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                  : isHalted
                  ? 'bg-rose-950/20 border-rose-800/80 shadow-lg shadow-rose-950/20'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                      {project?.title || 'Panchayat Infrastructure'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">&bull;</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {village?.name || 'Village'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{dispute.title}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    isResolved
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : isHalted
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {isResolved ? 'Resolved' : isHalted ? 'Community Halted' : 'Under Review'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800/50">
                "{dispute.description}"
              </p>

              {/* Upvote & 50% Consensus Progress Bar */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl mb-4">
                <div className="flex justify-between items-center text-[11px] mb-1.5 font-mono">
                  <span className="text-slate-400 font-bold">
                    Citizen Consensus: <span className="text-white font-bold">{upvotesCount}</span> / {totalCitizens} villagers ({(haltRatio * 100).toFixed(0)}%)
                  </span>
                  <span className={`text-[10px] font-bold uppercase ${haltRatio > 0.5 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {haltRatio > 0.5 ? '50% Threshold Exceeded' : 'Halt Threshold: 50%'}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      haltRatio > 0.5 ? 'bg-rose-500 shadow-sm shadow-rose-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.round(haltRatio * 100))}%` }}
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-[11px]">
                <div className="text-slate-500 font-medium">
                  Auditor: <span className="text-slate-300 font-bold">@{dispute.citizen?.username || 'Citizen'}</span>
                </div>

                {!isResolved && (
                  <button
                    onClick={() => onResolveDispute(dispute._id || dispute.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md shadow-emerald-600/15"
                  >
                    ✓ Arbitrate & Resolve Dispute
                  </button>
                )}
                {isResolved && (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Arbitration Closed & Ledger Synced
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {disputes.length === 0 && (
          <div className="text-center py-16 bg-slate-950/40 border border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">No disputes filed across Panchayats.</p>
          </div>
        )}
      </div>
    </div>
  );
}
