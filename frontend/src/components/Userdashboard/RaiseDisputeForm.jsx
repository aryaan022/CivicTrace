import React from 'react';

export default function RaiseDisputeForm({ newDispute, setNewDispute, projects, handleCreateDisputeSubmit }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-white tracking-tight">Raise Audit Dispute</h3>
        <p className="text-[11px] text-slate-400 font-medium">Spotted standard violations or poor construction work? Submit details to the ledger.</p>
      </div>

      <form onSubmit={handleCreateDisputeSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Target Panchayat Project</label>
          <select
            className="w-full px-3.5 py-2.5 border border-slate-800 rounded-lg text-xs bg-slate-950 text-slate-100 font-medium focus:outline-none focus:border-blue-500"
            value={newDispute.projectId}
            onChange={(e) => setNewDispute(prev => ({ ...prev, projectId: e.target.value }))}
          >
            {projects.filter(p => p.status !== "Completed").map(p => (
              <option key={p.id} value={p.id}>{p.title} (Status: {p.status})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Dispute Title / Issue Summary</label>
          <input 
            type="text"
            className="w-full px-3.5 py-2.5 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-slate-100 font-medium placeholder-slate-650 focus:outline-none focus:border-blue-500"
            placeholder="e.g. Substandard grade cement, cracked tiles, design delay"
            value={newDispute.title}
            onChange={(e) => setNewDispute(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Detailed Observation description</label>
          <textarea 
            rows="4"
            className="w-full px-3.5 py-2.5 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-slate-100 font-medium placeholder-slate-650 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            placeholder="Provide precise details, site coordinates or material issues observed. You can upload photo proofs in future milestones."
            value={newDispute.description}
            onChange={(e) => setNewDispute(prev => ({ ...prev, description: e.target.value }))}
            required
          ></textarea>
        </div>

        <div className="bg-slate-955/60 p-3 rounded-lg border border-slate-800/80 flex items-start gap-2">
          <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-[9px] text-slate-400 leading-relaxed font-normal">
            Your Aadhaar identity hash remains secure. Submitting a dispute allows other registered Panchayat citizens to audit and upvote this issue. Submitting files to ledger audits.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-450 text-slate-950 rounded-lg text-xs font-bold cursor-pointer transition shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
          >
            File Ledger Dispute
          </button>
        </div>
      </form>
    </div>
  );
}
