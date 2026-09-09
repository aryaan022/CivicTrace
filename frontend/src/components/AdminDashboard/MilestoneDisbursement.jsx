import React from 'react';

export default function MilestoneDisbursement({ projects, onDisburseMilestone }) {
  // Flatten milestones across projects
  const allMilestones = [];
  projects.forEach(project => {
    (project.milestones || []).forEach(milestone => {
      allMilestones.push({
        ...milestone,
        projectId: project._id || project.id,
        projectTitle: project.title,
        projectStatus: project.status,
        contractorName: project.contractorName,
        villageName: project.village?.name || 'Panchayat'
      });
    });
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">Milestone Fund Releases</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Review on-site photo proofs submitted by Sarpanchs, verify project consensus, and disburse public treasury funds.
        </p>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {allMilestones.map((m, idx) => {
          const isDisbursed = m.status === 'Disbursed';
          const isHalted = m.projectStatus === 'Halted';
          const hasProof = m.proofUrl && m.proofUrl.trim().length > 5;

          return (
            <div 
              key={idx}
              className={`p-5 rounded-2xl border transition ${
                isDisbursed
                  ? 'bg-slate-950/40 border-slate-800/60'
                  : isHalted
                  ? 'bg-rose-950/20 border-rose-800/70'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                      {m.projectTitle}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">&bull;</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {m.villageName}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{m.title}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    ₹{Number(m.amount).toLocaleString('en-IN')}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    isDisbursed
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : m.status === 'Pending' && hasProof
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {isDisbursed ? 'Disbursed' : hasProof ? 'Proof Attached' : 'Awaiting Proof'}
                  </span>
                </div>
              </div>

              {/* Photo Proof Display / Link */}
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl mb-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Sarpanch Inspection Proof
                  </span>
                  {hasProof ? (
                    <a
                      href={m.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-bold text-purple-400 hover:text-purple-300 underline flex items-center gap-1"
                    >
                      <span>Inspect Proof Document</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-[10px] text-amber-400/80 italic">No contractor photo uploaded yet</span>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-[11px]">
                <div className="text-slate-500 font-medium">
                  Contractor: <span className="text-slate-300 font-bold">{m.contractorName}</span>
                </div>

                {!isDisbursed ? (
                  isHalted ? (
                    <div className="text-rose-400 text-xs font-bold flex items-center gap-1.5 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-900">
                      🛑 Funds Locked: Project Halted by Citizen Consensus
                    </div>
                  ) : (
                    <button
                      onClick={() => onDisburseMilestone(m.projectId, m._id || m.id)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md shadow-purple-600/15"
                    >
                      💳 Authorize & Disburse ₹{Number(m.amount).toLocaleString('en-IN')}
                    </button>
                  )
                ) : (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Tranche Disbursed to Contractor
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {allMilestones.length === 0 && (
          <div className="text-center py-16 bg-slate-950/40 border border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">No milestone tranches available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
