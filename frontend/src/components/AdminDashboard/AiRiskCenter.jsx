import React, { useState } from 'react';

export default function AiRiskCenter({ aiReports, onRefreshAiReports, loadingAi }) {
  const [selectedReport, setSelectedReport] = useState(null);

  const criticalCount = aiReports.filter(r => r.riskReport?.riskLevel === 'Critical').length;
  const highCount = aiReports.filter(r => r.riskReport?.riskLevel === 'High').length;
  const mediumCount = aiReports.filter(r => r.riskReport?.riskLevel === 'Medium').length;
  const lowCount = aiReports.filter(r => r.riskReport?.riskLevel === 'Low').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              AI Risk & Anomaly Intelligence Center
            </h2>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              LangGraph StateGraph Agent
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated multi-node agent monitoring dispute velocity, budget anomalies, and public contractor risks.
          </p>
        </div>

        <button
          onClick={onRefreshAiReports}
          disabled={loadingAi}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer shadow-lg shadow-purple-600/20 flex items-center gap-2 disabled:opacity-50"
        >
          {loadingAi ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              Agent Executing...
            </>
          ) : (
            <>
              <span>⚡</span> Run Full Agent Risk Audit
            </>
          )}
        </button>
      </div>

      {/* Risk Summary Radar Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 bg-rose-950/20 border border-rose-800/60 rounded-xl">
          <div className="text-[10px] font-bold uppercase text-rose-400">Critical Risk</div>
          <div className="text-xl font-black text-rose-300 font-mono mt-0.5">{criticalCount}</div>
          <div className="text-[9px] text-slate-400 mt-0.5">Immediate intervention</div>
        </div>

        <div className="p-3.5 bg-amber-950/20 border border-amber-800/60 rounded-xl">
          <div className="text-[10px] font-bold uppercase text-amber-400">High Risk</div>
          <div className="text-xl font-black text-amber-300 font-mono mt-0.5">{highCount}</div>
          <div className="text-[9px] text-slate-400 mt-0.5">Inspection required</div>
        </div>

        <div className="p-3.5 bg-blue-950/20 border border-blue-800/60 rounded-xl">
          <div className="text-[10px] font-bold uppercase text-blue-400">Medium Risk</div>
          <div className="text-xl font-black text-blue-300 font-mono mt-0.5">{mediumCount}</div>
          <div className="text-[9px] text-slate-400 mt-0.5">Watchlist status</div>
        </div>

        <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/60 rounded-xl">
          <div className="text-[10px] font-bold uppercase text-emerald-400">Low Risk</div>
          <div className="text-xl font-black text-emerald-300 font-mono mt-0.5">{lowCount}</div>
          <div className="text-[9px] text-slate-400 mt-0.5">Nominal parameters</div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {aiReports.map((report, idx) => {
          const risk = report.riskReport || {};
          const level = risk.riskLevel || 'Low';
          const score = risk.compositeScore || 0;

          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                level === 'Critical'
                  ? 'bg-rose-950/15 border-rose-800/80 shadow-lg shadow-rose-950/20'
                  : level === 'High'
                  ? 'bg-amber-950/15 border-amber-800/70'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-0.5">
                      {report.villageName || 'Panchayat'} &bull; Status: {report.status}
                    </span>
                    <h3 className="text-sm font-bold text-white">{report.projectTitle}</h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Score: {score}/100
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      level === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' :
                      level === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      level === 'Medium' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {level}
                    </span>
                  </div>
                </div>

                {/* Synthesis Summary */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800/60 mb-3">
                  {risk.summary || 'LangGraph risk synthesis completed successfully.'}
                </p>

                {/* Flag Reasons */}
                {risk.flagReasons && risk.flagReasons.length > 0 && (
                  <div className="mb-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                      Anomaly Signals Detected:
                    </span>
                    {risk.flagReasons.map((flag, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300 bg-slate-900/40 p-1.5 rounded border border-slate-800/40">
                        <span className="text-amber-400 font-bold">⚠️</span>
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommended Enforcement Actions */}
                {risk.recommendedActions && risk.recommendedActions.length > 0 && (
                  <div className="mb-2 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-purple-400 tracking-wider block">
                      Agent Recommended Directives:
                    </span>
                    {risk.recommendedActions.map((action, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-1.5 text-[11px] text-slate-200 bg-purple-950/20 p-1.5 rounded border border-purple-800/30">
                        <span className="text-purple-400 font-bold">🎯</span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp footer */}
              <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between items-center font-mono">
                <span>Audited: {risk.timestamp ? new Date(risk.timestamp).toLocaleTimeString() : 'Recent'}</span>
                <span className="text-purple-400/80 font-bold">LangGraph v1.0 Node Synthesis</span>
              </div>
            </div>
          );
        })}

        {aiReports.length === 0 && (
          <div className="col-span-2 text-center py-16 bg-slate-950/40 border border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">Click "Run Full Agent Risk Audit" to evaluate infrastructure risk.</p>
          </div>
        )}
      </div>
    </div>
  );
}
