import React from 'react';

export default function Stats() {
  return (
    <section className="bg-slate-950/80 border-b border-t border-slate-800/80 text-white py-12 px-6 relative z-10">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/70">
        
        {/* Stat 1 */}
        <div className="py-4 md:py-0 flex flex-col items-center justify-center transition hover:scale-102 duration-300">
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1.5">
            ₹4.8 Crores
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
            Audited Project Funds
          </div>
        </div>

        {/* Stat 2 */}
        <div className="py-4 md:py-0 flex flex-col items-center justify-center transition hover:scale-102 duration-300">
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1.5">
            45 Villages
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
            Active Gram Panchayats
          </div>
        </div>

        {/* Stat 3 */}
        <div className="py-4 md:py-0 flex flex-col items-center justify-center transition hover:scale-102 duration-300">
          <div className="text-3xl sm:text-4xl font-black text-blue-400 tracking-tight mb-1.5">
            98.4%
          </div>
          <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none">
            Fund Verification Accuracy
          </div>
        </div>

      </div>
    </section>
  );
}
