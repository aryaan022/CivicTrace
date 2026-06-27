import React, { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: "Who is eligible to vote or dispute a project?",
    a: "Only verified citizens registered to the specific Village where the infrastructure project is physically active can vote or file a dispute. Your village jurisdiction is locked upon account creation and validated using local geographic bounds."
  },
  {
    q: "How is my Aadhaar database entry protected?",
    a: "We do not store your raw Aadhaar number. The 12-digit number is run through a Verhoeff validation check locally, and then salted and hashed into a unique string on the backend. This ensures database unique protection without compromising raw identity numbers."
  },
  {
    q: "What happens when a project is Red-Flagged?",
    a: "If the dispute rating crosses 50% of the active voter base, the system halts funding immediately. The District Admin receives an inquiry ticket. Village Heads cannot request further tranches until the dispute is resolved."
  }
];

export default function Faq() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFaq = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="faq" className="max-w-3xl w-full mx-auto px-6 py-20 relative z-10">
      
      {/* Title */}
      <div className="text-center mb-12">
        <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest block">Public Information</span>
        <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">Frequently Asked Questions</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4.5 rounded-full"></div>
      </div>

      {/* Accordions */}
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = expandedIndex === index;
          return (
            <div 
              key={index} 
              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-700/80 shadow-md"
            >
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4.5 flex justify-between items-center text-left text-sm font-bold text-white hover:bg-slate-900/50 cursor-pointer transition-colors"
              >
                <span>{item.q}</span>
                <span className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-400" : ""}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-[200px] border-t border-slate-800/60" : "max-h-0"
                }`}
              >
                <p className="px-6 py-5 text-xs text-slate-400 leading-relaxed text-left bg-slate-950/20 font-normal">
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
