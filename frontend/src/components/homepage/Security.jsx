import React from 'react';

export default function Security() {
  return (
    <section id="security" className="max-w-6xl w-full mx-auto px-6 py-20 border-b border-slate-900/60 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Spec Highlights */}
        <div className="lg:col-span-5 text-left">
          <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest block">System Specifications</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 mb-5 leading-tight">
            Cryptographic Integrity & Public Consensus Protocols
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed font-normal mb-8">
            CivicTrace operations follow zero-trust cryptographic models. We isolate identity tracking from audit storage, utilizing strict Mongoose schema rules to maintain platform trustworthiness.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-950 flex items-center justify-center text-blue-400 border border-blue-900/40 font-bold text-[10px]">✓</div>
              <span className="text-xs font-bold text-slate-350">Verhoeff Mathematical Verification</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-950 flex items-center justify-center text-blue-400 border border-blue-900/40 font-bold text-[10px]">✓</div>
              <span className="text-xs font-bold text-slate-350">SHA-256 Salt-and-Pepper Hashing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-950 flex items-center justify-center text-blue-400 border border-blue-900/40 font-bold text-[10px]">✓</div>
              <span className="text-xs font-bold text-slate-350">Immutable Database Coordinates (`immutable: true`)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Key Details Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Card 1 */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-5.5 rounded-2xl text-left hover:border-slate-700/80 transition duration-300">
            <div className="w-8 h-8 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400 border border-blue-900/40 mb-3.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Sybil-Resistant Checks</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Aadhaar numbers are validated locally via the Verhoeff algorithm. Registration routes then generate a deterministic SHA-256 hash using a server-side pepper variable, blocking fake voters.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-5.5 rounded-2xl text-left hover:border-slate-700/80 transition duration-300">
            <div className="w-8 h-8 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400 border border-blue-900/40 mb-3.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Geographic Node Locking</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Citizen audit locations are bound to their home Gram Panchayat at creation. Jurisdictions are locked as `immutable` inside Mongoose, preventing coordinated location-hopping manipulation.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-5.5 rounded-2xl text-left hover:border-slate-700/80 transition duration-300">
            <div className="w-8 h-8 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400 border border-blue-900/40 mb-3.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Geotagged Media Audit</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Completion photos are processed on upload. Exif geocoordinates are checked against target village boundaries. Verified metadata files are uploaded directly to Cloudinary.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-5.5 rounded-2xl text-left hover:border-slate-700/80 transition duration-300">
            <div className="w-8 h-8 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400 border border-blue-900/40 mb-3.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">50% Automatic Freezes</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Payout validation is autonomous. If active disputes represent 50% or more of registered local auditors, the ledger triggers a red flag and halts fund release immediately.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
