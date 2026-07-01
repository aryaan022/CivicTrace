import React, { useState } from 'react';

export default function MilestoneProofs({ projects, onUploadProof }) {
  const [selectedMilestone, setSelectedMilestone] = useState(null); // { projectId, milestoneId }
  const [proofUrl, setProofUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofUrl || !selectedMilestone) return;

    setSubmitting(true);
    const success = await onUploadProof(selectedMilestone.projectId, selectedMilestone.milestoneId, proofUrl);
    setSubmitting(false);
    
    if (success) {
      setProofUrl('');
      setSelectedMilestone(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-white tracking-tight">Upload Progress Proofs</h3>
        <p className="text-[11px] text-slate-400 font-medium">Select a pending project milestone tranche, upload its geotagged photo, and request citizen auditing.</p>
      </div>

      <div className="space-y-6">
        {projects.map(project => (
          <div key={project.id} className="bg-slate-950/40 border border-slate-800 p-4.5 rounded-xl space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <div>
                <h4 className="text-sm font-black text-white">{project.title}</h4>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Total Budget: ₹{project.budget.toLocaleString('en-IN')}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                project.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                project.status === "Halted" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}>
                {project.status}
              </span>
            </div>

            {/* Milestones Timeline List */}
            <div className="space-y-3.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Project Tranches & Milestones</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {project.milestones.map((m, idx) => {
                  const isSelected = selectedMilestone?.projectId === project.id && selectedMilestone?.milestoneId === m.id;
                  
                  return (
                    <div key={m.id} className="bg-slate-900 border border-slate-850 p-3 rounded-xl flex flex-col justify-between min-h-[110px] relative">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[7.5px] text-slate-500 font-bold uppercase tracking-wider">Tranche #{idx + 1}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            m.status === "Disbursed" ? "bg-emerald-500/10 text-emerald-400" :
                            m.proofUrl ? "bg-blue-500/10 text-blue-400 animate-pulse" :
                            "bg-slate-950 text-slate-450 border border-slate-800"
                          }`}>
                            {m.status === "Disbursed" ? "Disbursed" : m.proofUrl ? "Auditing" : "No Proof"}
                          </span>
                        </div>
                        <h5 className="text-[11px] font-bold text-white leading-tight">{m.title}</h5>
                        <p className="text-[9.5px] text-slate-400 mt-1 font-semibold">Allocated: ₹{m.amount.toLocaleString('en-IN')}</p>
                      </div>

                      {/* CTA Action button */}
                      <div className="mt-4.5 pt-2 border-t border-slate-850/80">
                        {m.status === "Disbursed" ? (
                          <div className="text-[9.5px] text-emerald-400 font-bold flex items-center gap-1">
                            ✓ Verified & Released
                          </div>
                        ) : m.proofUrl ? (
                          <div className="text-[9px] text-slate-500 font-medium">
                            Proof uploaded. Waiting for public consensus.
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedMilestone({ projectId: project.id, milestoneId: m.id })}
                            className={`w-full py-1 text-[9px] font-bold uppercase tracking-wider rounded border transition duration-200 cursor-pointer ${
                              isSelected 
                                ? "bg-blue-500 border-blue-500 text-slate-950 hover:bg-blue-450" 
                                : "bg-slate-950 border-slate-800 text-slate-350 hover:border-slate-700 hover:text-white"
                            }`}
                          >
                            {isSelected ? "Selected" : "Upload Proof"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Proof Submission Drawer / Modal (Only open when milestone is selected) */}
      {selectedMilestone && (
        <div className="fixed inset-0 bg-slate-955/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm p-5 shadow-2xl rounded-2xl text-left relative">
            <button 
              className="absolute top-4 right-4 text-slate-500 hover:text-white text-xl font-bold cursor-pointer"
              onClick={() => setSelectedMilestone(null)}
            >
              &times;
            </button>

            <div className="pb-3 border-b border-slate-850 mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Upload Milestone Proof</h4>
              <span className="text-[8.5px] text-slate-500 uppercase block font-semibold mt-0.5">Submit geotagged site photo details</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Site Photo URL (Geotagged Proof)</label>
                <input 
                  type="url"
                  className="w-full px-3.5 py-2.5 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-slate-100 placeholder-slate-650 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25"
                  placeholder="https://imgur.com/your-geotagged-proof.jpg"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  required
                />
              </div>

              <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850/80 flex gap-2">
                <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-[9.5px] text-slate-400 leading-normal font-normal">
                  Uploading this proof activates citizen audit voting inside user dashboards. Citizens will verify coordinates before consensus.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3.5 border-t border-slate-850">
                <button 
                  type="button"
                  className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold cursor-pointer transition"
                  onClick={() => setSelectedMilestone(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-550 text-slate-950 rounded-lg text-xs font-bold cursor-pointer transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit to Ledger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
