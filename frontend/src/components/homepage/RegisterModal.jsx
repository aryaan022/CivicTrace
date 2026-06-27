import React, { useState } from 'react';

const MOCK_VILLAGES = [
  { id: "v1", name: "Rampur Panchayat", district: "Patna" },
  { id: "v2", name: "Sonpur Society", district: "Saran" },
  { id: "v3", name: "Pipili Village", district: "Puri" }
];

export default function RegisterModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    aadhaar: "",
    role: "Citizen",
    villageId: "v1",
    password: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Aadhaar number input filter (only digits, max length 12)
    if (name === "aadhaar") {
      const digits = value.replace(/\D/g, '').slice(0, 12);
      setForm(prev => ({ ...prev, [name]: digits }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 shadow-2xl rounded-2xl text-left relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-slate-800/80 mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Create Auditor Account</h3>
          <span className="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">Register verified citizen or administrator profile</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Name and Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
              <input 
                type="text" 
                name="name"
                className="w-full px-3.5 py-2 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-slate-100 font-medium placeholder-slate-650 focus:outline-none focus:border-blue-500" 
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Username</label>
              <input 
                type="text" 
                name="username"
                className="w-full px-3.5 py-2 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-slate-100 font-medium placeholder-slate-650 focus:outline-none focus:border-blue-500" 
                placeholder="johndoe"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 2: Email and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
              <input 
                type="email" 
                name="email"
                className="w-full px-3.5 py-2 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-slate-100 font-medium placeholder-slate-650 focus:outline-none focus:border-blue-500" 
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                className="w-full px-3.5 py-2 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-slate-100 font-medium placeholder-slate-650 focus:outline-none focus:border-blue-500" 
                placeholder="9876543210"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 3: Aadhaar */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Aadhaar Number (12-digit)
            </label>
            <input 
              type="text" 
              name="aadhaar"
              maxLength="12"
              className="w-full px-3.5 py-2 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-slate-100 font-mono tracking-wider focus:outline-none focus:border-blue-500" 
              placeholder="0000 0000 0000"
              value={form.aadhaar}
              onChange={handleChange}
              required
            />
          </div>

          {/* Row 4: Role & Village Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Assign Role</label>
              <select 
                name="role"
                className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-950 text-slate-100 font-medium focus:outline-none focus:border-blue-500"
                value={form.role}
                onChange={handleChange}
              >
                <option value="Citizen">Citizen</option>
                <option value="VillageHead">Village Head (Panchayat)</option>
                <option value="Admin">District Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Assign Village (Jurisdiction)</label>
              <select 
                name="villageId"
                className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-950 text-slate-100 font-medium focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                value={form.villageId}
                onChange={handleChange}
                disabled={form.role === "Admin"}
              >
                {MOCK_VILLAGES.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Password */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Security Password</label>
            <input 
              type="password" 
              name="password"
              className="w-full px-3.5 py-2.5 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-slate-100 font-medium placeholder-slate-655 focus:outline-none focus:border-blue-500" 
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Verification Warning Banner */}
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 flex items-start gap-2.5">
            <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-[9px] text-slate-400 leading-relaxed">
              Auditor signatures submit to <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-400 border border-slate-800 font-bold">POST /api/auth/register</code>. Aadhaar values are processed via Verhoeff verification and cryptographically pepper-hashed before write.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2.5 pt-3.5 border-t border-slate-800/80">
            <button 
              type="button" 
              className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold cursor-pointer transition duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer shadow-md shadow-blue-500/10 transition duration-200"
            >
              Register Identity
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
