import React, { useState } from 'react';

export default function ProjectsManager({ projects, villages, onCreateProject, onAuditProject }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVillageFilter, setSelectedVillageFilter] = useState('ALL');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    villageId: villages[0]?._id || '',
    totalBudget: '',
    contractorName: '',
    milestone1Title: 'Tranche 1: Foundation & Material Procurement',
    milestone1Amount: '',
    milestone2Title: 'Tranche 2: Structural Framing & Construction',
    milestone2Amount: '',
    milestone3Title: 'Tranche 3: Finishing & Final Public Audit',
    milestone3Amount: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBudgetChange = (e) => {
    const total = Number(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      totalBudget: e.target.value,
      milestone1Amount: Math.round(total * 0.3),
      milestone2Amount: Math.round(total * 0.4),
      milestone3Amount: Math.round(total * 0.3)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      villageId: formData.villageId || villages[0]?._id,
      totalBudget: Number(formData.totalBudget),
      contractorName: formData.contractorName,
      milestones: [
        { title: formData.milestone1Title, amount: Number(formData.milestone1Amount), status: 'Pending', proofUrl: '' },
        { title: formData.milestone2Title, amount: Number(formData.milestone2Amount), status: 'Pending', proofUrl: '' },
        { title: formData.milestone3Title, amount: Number(formData.milestone3Amount), status: 'Pending', proofUrl: '' }
      ]
    };

    const success = await onCreateProject(payload);
    if (success) {
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        villageId: villages[0]?._id || '',
        totalBudget: '',
        contractorName: '',
        milestone1Title: 'Tranche 1: Foundation & Material Procurement',
        milestone1Amount: '',
        milestone2Title: 'Tranche 2: Structural Framing & Construction',
        milestone2Amount: '',
        milestone3Title: 'Tranche 3: Finishing & Final Public Audit',
        milestone3Amount: ''
      });
    }
  };

  const filteredProjects = selectedVillageFilter === 'ALL'
    ? projects
    : projects.filter(p => (p.village?._id || p.village) === selectedVillageFilter);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Panchayat Project Registry</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Authorize new works, define milestone payment tranches, and monitor contractor execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedVillageFilter}
            onChange={(e) => setSelectedVillageFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Jurisdictions ({projects.length})</option>
            {villages.map(v => (
              <option key={v._id} value={v._id}>{v.name}</option>
            ))}
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer shadow-lg shadow-purple-600/15 shrink-0"
          >
            + Register Work
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map(project => (
          <div key={project._id || project.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-0.5">
                    {project.village?.name || 'Local Panchayat'} &bull; {project.village?.district || 'District'}
                  </span>
                  <h3 className="text-sm font-bold text-white">{project.title}</h3>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                  project.status === 'Halted' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse' :
                  project.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {project.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                {project.description}
              </p>

              {/* Contractor & Budget Stats */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl mb-4 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Contractor</span>
                  <span className="text-slate-200 font-semibold">{project.contractorName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Total Budget</span>
                  <span className="text-slate-100 font-mono font-bold">₹{Number(project.totalBudget || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Milestones Progress */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Milestone Tranches</span>
                {(project.milestones || []).map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] p-2 bg-slate-900/40 rounded-lg border border-slate-800/50">
                    <span className="text-slate-300 font-medium truncate max-w-[55%]">{m.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[10px]">₹{Number(m.amount).toLocaleString('en-IN')}</span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        m.status === 'Disbursed' ? 'text-emerald-400 bg-emerald-500/10' :
                        m.status === 'Approved' ? 'text-blue-400 bg-blue-500/10' :
                        'text-amber-400 bg-amber-500/10'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-medium">
                {project.disputesCount || 0} disputes logged
              </span>
              <button
                onClick={() => onAuditProject(project._id || project.id)}
                className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
              >
                🤖 Run AI Risk Audit
              </button>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-2 text-center py-16 bg-slate-950/40 border border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">No projects found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-6 shadow-2xl rounded-2xl text-left relative max-h-[90vh] overflow-y-auto">
            <button 
              className="absolute top-4 right-4 text-slate-500 hover:text-white text-xl font-bold cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>

            <div className="pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Register Infrastructure Project</h3>
              <span className="text-[10px] text-slate-400">Assign village budget and configure milestone payment tranches</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Project Title</label>
                <input 
                  type="text" 
                  name="title" 
                  placeholder="e.g. Concrete Pavement Road - Sector 4"
                  value={formData.title} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500" 
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Project Description</label>
                <textarea 
                  name="description" 
                  placeholder="Details of construction, target specifications, and public utility..."
                  value={formData.description} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 min-h-[70px]" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Jurisdiction Panchayat</label>
                  <select 
                    name="villageId" 
                    value={formData.villageId} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {villages.map(v => (
                      <option key={v._id} value={v._id}>{v.name} ({v.district})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contractor / Agency</label>
                  <input 
                    type="text" 
                    name="contractorName" 
                    placeholder="e.g. Apex Civil Infra Ltd"
                    value={formData.contractorName} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Project Budget (INR)</label>
                <input 
                  type="number" 
                  name="totalBudget" 
                  placeholder="e.g. 500000"
                  value={formData.totalBudget} 
                  onChange={handleBudgetChange} 
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-purple-500" 
                  required 
                />
              </div>

              {/* Milestone Tranche Config */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <span className="text-[10px] font-bold uppercase text-purple-400 tracking-wider block">
                  Milestone Tranches (30% - 40% - 30% Split)
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 text-[11px] text-slate-300 font-medium truncate">{formData.milestone1Title}</div>
                  <input type="number" name="milestone1Amount" value={formData.milestone1Amount} onChange={handleChange} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-right font-mono text-slate-200" required />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 text-[11px] text-slate-300 font-medium truncate">{formData.milestone2Title}</div>
                  <input type="number" name="milestone2Amount" value={formData.milestone2Amount} onChange={handleChange} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-right font-mono text-slate-200" required />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 text-[11px] text-slate-300 font-medium truncate">{formData.milestone3Title}</div>
                  <input type="number" name="milestone3Amount" value={formData.milestone3Amount} onChange={handleChange} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-right font-mono text-slate-200" required />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-lg text-xs font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold uppercase cursor-pointer">
                  Register Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
