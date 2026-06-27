import React from 'react';

const STEPS = [
  {
    num: "01",
    phase: "Allocation",
    title: "Milestone Tranche Setup",
    desc: "Admin configures budget allocation. Total cost is locked into milestone tranches (e.g. 30% initial tranche, 40% mid-stage, 30% handover release)."
  },
  {
    num: "02",
    phase: "Submission",
    title: "Proof-of-Work Geotagging",
    desc: "Village Head uploads photos upon milestone completion. Platform extracts GPS tags and stores files immutably to prevent off-site report spoofing."
  },
  {
    num: "03",
    phase: "Consensus",
    title: "Citizen Ledger Voting",
    desc: "Registered local citizens examine geotagged photos. A vote is cast to either approve progress or raise an official audit dispute."
  },
  {
    num: "04",
    phase: "Resolution",
    title: "Payout Release or Lock",
    desc: "If disputes exceed the 50% threshold of village voters, the system triggers a red flag and locks the fund. Otherwise, the next tranche is unlocked."
  }
];

export default function Workflow() {
  return (
    <section id="process" className="max-w-6xl w-full mx-auto px-6 py-20 border-b border-slate-900/60 relative z-10">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest block">Audit Pipeline</span>
        <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">Verification Ledger Workflow</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4.5 rounded-full"></div>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((step, idx) => (
          <div 
            key={idx} 
            className="group bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 text-left transition-all duration-300 shadow-md relative hover:-translate-y-1.5"
          >
            {/* Visual Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] bg-blue-950 text-blue-400 px-2.5 py-1 rounded font-black border border-blue-900/40">
                STEP {step.num}
              </span>
              <span className="text-xs text-slate-500 group-hover:text-slate-400 font-bold uppercase tracking-wider transition-colors">
                {step.phase}
              </span>
            </div>

            {/* Description */}
            <h4 className="text-base font-bold text-white mb-2.5 group-hover:text-blue-400 transition-colors">
              {step.title}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
