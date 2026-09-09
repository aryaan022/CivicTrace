import React from 'react';

export default function Overview({ projects, disputes, villages, aiReports, onNavigateTab }) {
  const totalProjects = projects.length;
  const totalAllocated = projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);
  const totalDisbursed = projects.reduce((sum, p) => sum + (p.disbursedBudget || 0), 0);
  const haltedCount = projects.filter(p => p.status === 'Halted').length;
  const activeDisputes = disputes.filter(d => d.status !== 'Resolved').length;
  const criticalRiskCount = aiReports.filter(r => r.riskReport?.riskLevel === 'Critical' || r.riskReport?.riskLevel === 'High').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black uppercase tracking-wider text-white">District Ledger Telemetry</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Authority View
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Cross-panchayat auditing consensus, budget releases, and LangGraph anomaly monitoring
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('projects')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer shadow-lg shadow-purple-600/15"
        >
          + Register Project
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Allocated Funds</div>
          <div className="text-xl font-black text-white font-mono">
            ₹{totalAllocated.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            Disbursed: ₹{totalDisbursed.toLocaleString('en-IN')} ({totalAllocated > 0 ? Math.round((totalDisbursed/totalAllocated)*100) : 0}%)
          </div>
          <div className="absolute top-3 right-3 text-lg opacity-30">💰</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Panchayat Works</div>
          <div className="text-xl font-black text-white font-mono">{totalProjects}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            Across {villages.length} jurisdictions
          </div>
          <div className="absolute top-3 right-3 text-lg opacity-30">🏗️</div>
        </div>

        {/* Metric 3: Halted Projects */}
        <div className={`p-4 rounded-xl border relative overflow-hidden ${
          haltedCount > 0
            ? 'bg-rose-950/20 border-rose-800/60 text-rose-300'
            : 'bg-slate-950/60 border-slate-800 text-slate-300'
        }`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">50% Consensus Halts</div>
          <div className="text-xl font-black font-mono text-rose-400">{haltedCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            {haltedCount > 0 ? 'Disbursement locked by citizens' : 'No automatic locks active'}
          </div>
          <div className="absolute top-3 right-3 text-lg opacity-40">🛑</div>
        </div>

        {/* Metric 4: AI Risk Alert */}
        <div className={`p-4 rounded-xl border relative overflow-hidden ${
          criticalRiskCount > 0
            ? 'bg-amber-950/20 border-amber-800/60 text-amber-300'
            : 'bg-slate-950/60 border-slate-800 text-slate-300'
        }`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">AI Anomaly Flags</div>
          <div className="text-xl font-black font-mono text-amber-400">{criticalRiskCount}</div>
          <div className="text-[10px] text-amber-400/80 mt-1">
            LangGraph high-risk flags
          </div>
          <div className="absolute top-3 right-3 text-lg opacity-40">🤖</div>
        </div>
      </div>

      {/* Quick Action Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active & Halted Projects Status */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Active Infrastructure Works</h3>
            <button 
              onClick={() => onNavigateTab('projects')}
              className="text-[10px] text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider"
            >
              View All &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {projects.slice(0, 4).map(p => (
              <div key={p.id || p._id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-white">{p.title}</div>
                  <div className="text-[10px] text-slate-400">
                    {p.village?.name || 'Panchayat'} &bull; ₹{Number(p.totalBudget || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  p.status === 'Halted' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  p.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-500 font-medium">No projects registered yet.</div>
            )}
          </div>
        </div>

        {/* AI Risk Quick Radar */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">AI LangGraph Risk Stream</h3>
            <button 
              onClick={() => onNavigateTab('ai-risk')}
              className="text-[10px] text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider"
            >
              Inspect Agent Radar &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {aiReports.slice(0, 4).map((r, idx) => {
              const level = r.riskReport?.riskLevel || 'Low';
              return (
                <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <div className="font-bold text-xs text-white truncate">{r.projectTitle}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {r.riskReport?.flagReasons?.[0] || 'Nominal operation parameters.'}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    level === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    level === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {level}
                  </span>
                </div>
              );
            })}
            {aiReports.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-500 font-medium">No anomaly streams available.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
