import React from 'react';

export default function Home({ setCurrentPage, user, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  return (
    <div className="font-sans antialiased bg-white text-brand-black flex flex-col min-h-screen selection:bg-brand-blue selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-brand-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-6 h-6 bg-brand-black rounded-sm"></div>
            <span className="text-xl font-bold tracking-tight">CivicTrace</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#how-it-works" className="text-gray-500 hover:text-brand-black transition-colors">Architecture</a>
            <a href="#feed" className="text-gray-500 hover:text-brand-black transition-colors">Public Ledger</a>
            
            <div className="h-4 w-px bg-gray-300"></div>
            
            {user ? (
              <>
                <span className="text-gray-700 font-medium text-xs md:text-sm">
                  Welcome, <span className="font-semibold">{user.name}</span>
                  <span className="ml-2 bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200 uppercase">
                    {user.role}
                  </span>
                </span>
                {user.role === 'admin' && (
                  <button 
                    onClick={() => setCurrentPage('admin-dashboard')}
                    className="text-brand-blue hover:underline text-sm font-semibold transition-all cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                )}
                <button 
                  onClick={handleLogout} 
                  className="bg-brand-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all shadow-sm cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setCurrentPage('login')} className="text-gray-500 hover:text-brand-black transition-colors">Sign in</button>
                <button 
                  onClick={() => setCurrentPage('register')} 
                  className="bg-brand-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all shadow-sm"
                >
                  Register Entity
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 mb-8 tracking-wide">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 
                System Status: Operational
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                Verifiable auditing for <br />
                <span className="text-gray-400">local infrastructure.</span>
              </h1>
              
              <p className="text-lg text-gray-500 mb-10 max-w-lg leading-relaxed">
                A decentralized ledger bridging the gap between district administration and village societies. Powered by verified identities and mandatory community consensus.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => {
                    if (user) {
                      if (user.role === 'admin') {
                        setCurrentPage('admin-dashboard');
                      } else {
                        alert(`Welcome back, ${user.name}! The audit dashboard is currently in development.`);
                      }
                    } else {
                      setCurrentPage('login');
                    }
                  }} 
                  className="bg-brand-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {user ? 'View Dashboard' : 'Access Portal'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
                <a href="#how-it-works" className="bg-white text-brand-black border border-gray-200 px-6 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
                  Read the Docs
                </a>
              </div>
            </div>

            {/* Visual Panel */}
            <div className="lg:col-span-5 hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-white rounded-2xl border border-gray-200 shadow-xl transform rotate-2 scale-105"></div>
              <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Latest Allocation</span>
                  <span className="text-xs font-mono text-gray-500">ID: TRC-8492</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0"></div>
                  <div>
                    <div className="h-3 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 w-20 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-500">Community Consensus</span>
                    <span className="text-xs font-semibold text-green-600">82% Verified</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-brand-border bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-brand-black">124</span>
                <span className="text-sm text-gray-500 font-medium mt-1">Active Projects</span>
              </div>
              <div className="flex flex-col pl-8">
                <span className="text-3xl font-bold text-brand-black">12</span>
                <span className="text-sm text-gray-500 font-medium mt-1">Districts Onboarded</span>
              </div>
              <div className="flex flex-col pl-8">
                <span className="text-3xl font-bold text-brand-black">8.4k</span>
                <span className="text-sm text-gray-500 font-medium mt-1">Verified Citizens</span>
              </div>
              <div className="flex flex-col pl-8">
                <span className="text-3xl font-bold text-brand-black">0</span>
                <span className="text-sm text-gray-500 font-medium mt-1">Data Breaches</span>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">System Architecture</h2>
            <p className="text-gray-500">Built securely from the ground up to prevent data manipulation and ensure absolute transparency in fund deployment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
            <div>
              <div className="w-8 h-8 border-2 border-brand-black rounded flex items-center justify-center text-sm font-bold mb-6">01</div>
              <h3 className="text-lg font-bold mb-2">Immutable Verification</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Identity hashing prevents Sybil attacks. Once a user is mapped to a regional jurisdiction, the assignment is permanently locked in the database.</p>
            </div>
            <div>
              <div className="w-8 h-8 border-2 border-brand-black rounded flex items-center justify-center text-sm font-bold mb-6">02</div>
              <h3 className="text-lg font-bold mb-2">Algorithmic Auditing</h3>
              <p className="text-gray-500 text-sm leading-relaxed">No manual intervention required. If verified citizen disputes cross the 50% threshold of the registered population, the task is automatically frozen.</p>
            </div>
            <div>
              <div className="w-8 h-8 border-2 border-brand-black rounded flex items-center justify-center text-sm font-bold mb-6">03</div>
              <h3 className="text-lg font-bold mb-2">Milestone Tranches</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Funds are cryptographically tied to visual and geographical proof of work. Admins release capital only when strict milestone conditions are met.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-border bg-white pt-12 pb-8 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-semibold text-brand-black">CivicTrace &copy; 2026</div>
          <div className="flex gap-6 text-gray-500">
            <a href="#" className="hover:text-brand-black transition-colors">GitHub Repository</a>
            <a href="#" className="hover:text-brand-black transition-colors">API Docs</a>
            <a href="#" className="hover:text-brand-black transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
