import { useState, useEffect } from 'react';
import Navbar from './components/homepage/Navbar';
import Hero from './components/homepage/Hero';
import Stats from './components/homepage/Stats';
import VillageCarousel from './components/homepage/VillageCarousel';
import Workflow from './components/homepage/Workflow';
import Security from './components/homepage/Security';
import Faq from './components/homepage/Faq';
import LoginModal from './components/homepage/LoginModal';
import RegisterModal from './components/homepage/RegisterModal';
import CitizenDashboard from './components/Userdashboard/Dashboard';
import VillageHeadDashboard from './components/VillageHeadDashboard/Dashboard';
import AdminDashboard from './components/AdminDashboard/Dashboard';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Manage user session from localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync and fetch fresh user profile info on mount or token changes
  useEffect(() => {
    if (token) {
      fetch("/api/user/dashboard", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) throw new Error("Token expired");
        return res.json();
      })
      .then(data => {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }
      })
      .catch(err => {
        console.error("Session refresh error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      });
    }
  }, [token]);

  const handleLoginSubmit = async (loginForm) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setIsLoginOpen(false);
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login client error:", err);
      alert("Unable to reach the server. Make sure the backend server is running.");
    }
  };

  const handleRegisterSubmit = async (registerForm) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm)
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Logging you in...");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setIsRegisterOpen(false);
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Register client error:", err);
      alert("Unable to reach the server. Make sure the backend server is running.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans flex flex-col antialiased">
      
      {/* Navbar */}
      <Navbar 
        onOpenLogin={() => setIsLoginOpen(true)} 
        onOpenRegister={() => setIsRegisterOpen(true)} 
        user={user}
        onLogout={handleLogout}
      />

      {user ? (
        user.role === "Admin" ? (
          <AdminDashboard user={user} onLogout={handleLogout} />
        ) : user.role === "VillageHead" ? (
          <VillageHeadDashboard user={user} onLogout={handleLogout} />
        ) : (
          <CitizenDashboard user={user} onLogout={handleLogout} />
        )
      ) : (
        <>
          {/* Hero Section with Consensus Simulation */}
          <Hero 
            onOpenRegister={() => setIsRegisterOpen(true)} 
            onOpenLogin={() => setIsLoginOpen(true)} 
          />

          {/* Statistics Banner */}
          <Stats />

          {/* Village Carousel (Village Audit Logs) */}
          <VillageCarousel />

          {/* Audit workflow timeline */}
          <Workflow />

          {/* Cryptographic Specifications */}
          <Security />

          {/* FAQ accordions */}
          <Faq />

          {/* Bottom Call to Action Section */}
          <section className="bg-slate-950/40 border-t border-slate-900/60 py-16 px-6 relative z-10 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl md:text-2xl font-black text-white mb-3">Decentralized Auditing. Complete Transparency.</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-sm mx-auto font-normal">
                Verify infrastructure works in your local Panchayat in real-time. Join the community auditing ledger today.
              </p>
              <button 
                className="bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg transition duration-200 cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25"
                onClick={() => setIsRegisterOpen(true)}
              >
                Create Citizen Account
              </button>
            </div>
          </section>
        </>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSubmit={handleLoginSubmit} 
      />

      {/* Register Modal */}
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSubmit={handleRegisterSubmit} 
      />

      <footer className="bg-slate-950 text-slate-400 py-12 px-6 text-[11px] mt-auto border-t border-slate-900/80">
        <div className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <div className="font-extrabold text-slate-300 text-xs tracking-wider uppercase mb-1">
              District Panchayat Audit Committee
            </div>
            <div className="text-slate-500 font-normal">
              CivicTrace Auditing Ledger &copy; 2026. Secure cryptographic platform.
            </div>
          </div>
          <div className="flex gap-6 font-bold uppercase tracking-wider text-[10px]">
            <a href="#" className="hover:text-white transition-colors">Security Policy</a>
            <a href="#" className="hover:text-white transition-colors">Auditing Rules</a>
            <a href="#" className="hover:text-white transition-colors">API Console</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
