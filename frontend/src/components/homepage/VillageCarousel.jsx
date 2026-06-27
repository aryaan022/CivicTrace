import React, { useState, useEffect } from 'react';

const CAROUSEL_SLIDES = [
  {
    image: "/1.jpg",
    title: "Empowering Rural India at the Grassroots",
    description: "Connecting Gram Panchayats with verifiable auditing ledgers, ensuring local citizens actively shape their community development."
  },
  {
    image: "/2.jpg",
    title: "Fostering Community Trust & Collaboration",
    description: "Bringing authentic governance to villages by enabling transparent funding coordination between local village heads and citizens."
  }
];

export default function VillageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto transition every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === CAROUSEL_SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 px-6 bg-[#0b0f19] border-t border-slate-900/60 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase bg-blue-950/40 border border-blue-900/40 px-3 py-1 rounded-full inline-block mb-4">
          Real Communities served
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
          Built for Real Villages, Run by Real Citizens
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-10 leading-relaxed font-normal">
          CivicTrace operates directly at the heart of local Gram Panchayats. Our platform bridges the gap between digital consensus audits and the actual families living in rural India.
        </p>

        {/* Slide Frame */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl group">
          
          {/* Active Image */}
          <div className="w-full h-full relative transition-all duration-700 ease-in-out">
            <img 
              src={CAROUSEL_SLIDES[currentIndex].image} 
              alt={CAROUSEL_SLIDES[currentIndex].title}
              className="w-full h-full object-cover opacity-90 transition-opacity duration-500" 
            />
            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          </div>

          {/* Nav Arrows */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-slate-900/70 border border-slate-800 text-white hover:bg-slate-800 hover:border-slate-700 transition duration-200 cursor-pointer hidden group-hover:block"
          >
            ←
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-slate-900/70 border border-slate-800 text-white hover:bg-slate-800 hover:border-slate-700 transition duration-200 cursor-pointer hidden group-hover:block"
          >
            →
          </button>

          {/* Lower caption panel */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-left bg-gradient-to-t from-slate-950 to-slate-950/0 flex flex-col justify-end min-h-[100px]">
            <h4 className="text-sm md:text-base font-bold text-white tracking-tight">
              {CAROUSEL_SLIDES[currentIndex].title}
            </h4>
            <p className="text-[11px] text-slate-350 mt-1 max-w-xl font-normal leading-relaxed">
              {CAROUSEL_SLIDES[currentIndex].description}
            </p>
          </div>

          {/* Dot Indicators */}
          <div className="absolute top-4 right-4 flex gap-1.5 z-10 bg-slate-950/60 backdrop-blur-sm border border-slate-850 px-2.5 py-1.5 rounded-lg">
            {CAROUSEL_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${currentIndex === idx ? 'bg-blue-400 w-3' : 'bg-slate-600 hover:bg-slate-400'}`}
              ></button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
