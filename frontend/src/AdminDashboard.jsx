import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ setCurrentPage, user, setUser }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({ totalProjects: 0, openTickets: 0, totalAllocated: 0, totalReleased: 0 });
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [villages, setVillages] = useState([]);
  const [villageHeads, setVillageHeads] = useState([]);

  // Create Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    villageId: '',
    assignedVillageHead: '',
    totalAllocated: '',
    estimatedCompletionDate: ''
  });

  // Action input states
  const [releaseAmounts, setReleaseAmounts] = useState({}); // { projectId: amount }
  const [ticketResponses, setTicketResponses] = useState({}); // { ticketId: responseText }
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('http://localhost:3000/api/admin/stats');
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      // 2. Fetch Projects
      const projRes = await fetch('http://localhost:3000/api/admin/projects');
      const projData = await projRes.json();
      if (projData.success) setProjects(projData.projects);

      // 3. Fetch Tickets
      const ticketRes = await fetch('http://localhost:3000/api/admin/tickets');
      const ticketData = await ticketRes.json();
      if (ticketData.success) setTickets(ticketData.tickets);

      // 4. Fetch Villages
      const villageRes = await fetch('http://localhost:3000/api/villages');
      const villageData = await villageRes.json();
      if (villageData.success) setVillages(villageData.villages);

      // 5. Fetch Village Heads
      const headRes = await fetch('http://localhost:3000/api/admin/users/village-heads');
      const headData = await headRes.json();
      if (headData.success) setVillageHeads(headData.villageHeads);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setErrorMsg('Failed to load dashboard data. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
  };

  // Create Project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccessMsg('Project created successfully!');
        setNewProject({
          title: '',
          description: '',
          villageId: '',
          assignedVillageHead: '',
          totalAllocated: '',
          estimatedCompletionDate: ''
        });
        fetchData(); // reload
      } else {
        setErrorMsg(data.message || 'Failed to create project');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMsg('Network error creating project.');
    }
  };

  // Release Budget
  const handleReleaseBudget = async (projectId) => {
    const amount = releaseAmounts[projectId];
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`http://localhost:3000/api/admin/projects/${projectId}/release-budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`Funds released successfully!`);
        setReleaseAmounts(prev => ({ ...prev, [projectId]: '' }));
        fetchData();
      } else {
        setErrorMsg(data.message || 'Failed to release funds');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error connecting to release budget endpoint.');
    }
  };

  // Update Status
  const handleUpdateStatus = async (projectId, status) => {
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`http://localhost:3000/api/admin/projects/${projectId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`Project status updated to ${status}!`);
        fetchData();
      } else {
        setErrorMsg(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error updating status.');
    }
  };

  // Resolve Ticket
  const handleResolveTicket = async (ticketId) => {
    const adminResponse = ticketResponses[ticketId];
    if (!adminResponse || adminResponse.trim() === '') {
      alert('Please write an explanation to resolve the ticket.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`http://localhost:3000/api/admin/tickets/${ticketId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminResponse })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg('Ticket resolved successfully!');
        setTicketResponses(prev => ({ ...prev, [ticketId]: '' }));
        fetchData();
      } else {
        setErrorMsg(data.message || 'Failed to resolve ticket');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error resolving ticket.');
    }
  };

  return (
    <div className="font-sans antialiased bg-gray-50 text-brand-black min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-brand-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-6 h-6 bg-brand-black rounded-sm"></div>
            <span className="text-xl font-bold tracking-tight">CivicTrace Admin</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            <button onClick={() => setCurrentPage('home')} className="text-gray-500 hover:text-brand-black transition-colors cursor-pointer">
              View Site
            </button>
            <span className="text-gray-400">|</span>
            <span className="text-gray-700 font-semibold">{user?.name} (Admin)</span>
            <button onClick={handleLogout} className="bg-brand-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all shadow-sm cursor-pointer">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Admin Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Tabs Selection */}
        <div className="flex border-b border-gray-200 mb-8 gap-4">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 cursor-pointer ${activeTab === 'stats' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-brand-black'}`}
          >
            Overview & Stats
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 cursor-pointer ${activeTab === 'projects' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-brand-black'}`}
          >
            Manage Projects
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 cursor-pointer ${activeTab === 'tickets' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-brand-black'}`}
          >
            Disputes & Tickets ({stats.openTickets} Open)
          </button>
        </div>

        {/* Global Notifications */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm">
            {successMsg}
          </div>
        )}

        {/* Tab Contents: Overview Stats */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Dashboard Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Projects</span>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.totalProjects}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Open Tickets</span>
                <p className="text-3xl font-extrabold text-red-600 mt-2">{stats.openTickets}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Budget Allocated</span>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">₹{stats.totalAllocated.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Budget Released</span>
                <p className="text-3xl font-extrabold text-green-600 mt-2">₹{stats.totalReleased.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Navigation Guide</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mb-4">
                As a central administrator, you are responsible for monitoring rural infrastructure development. 
                Use the **Manage Projects** tab to allocate budget allocations and assign villages to verification heads. 
                Use the **Disputes & Tickets** tab to review, read, and resolve citizen objections immediately.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setActiveTab('projects')} className="bg-brand-blue text-white px-4 py-2 rounded font-semibold text-sm hover:bg-blue-700 transition-all cursor-pointer">
                  Go to Projects
                </button>
                <button onClick={() => setActiveTab('tickets')} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-50 transition-all cursor-pointer">
                  View Disputes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Contents: Manage Projects */}
        {activeTab === 'projects' && (
          <div className="flex flex-col md:flex-row gap-8 items-start w-full">
            {/* Create Project Form */}
            <div className="w-full md:w-[35%] bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
              <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Allocate New Project</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider">Project Title</label>
                  <input 
                    type="text"
                    required
                    value={newProject.title}
                    onChange={e => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider">Description</label>
                  <textarea 
                    rows="3"
                    required
                    value={newProject.description}
                    onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider">Select Village</label>
                  <select
                    required
                    value={newProject.villageId}
                    onChange={e => setNewProject(prev => ({ ...prev, villageId: e.target.value }))}
                    className="mt-1 w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white"
                  >
                    <option value="">-- Choose Village --</option>
                    {villages.map(v => (
                      <option key={v._id} value={v._id}>{v.name} ({v.district})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider">Assign Village Head</label>
                  <select
                    required
                    value={newProject.assignedVillageHead}
                    onChange={e => setNewProject(prev => ({ ...prev, assignedVillageHead: e.target.value }))}
                    className="mt-1 w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white"
                  >
                    <option value="">-- Choose Head --</option>
                    {villageHeads.map(vh => (
                      <option key={vh._id} value={vh._id}>{vh.name} (Village: {vh.village?.name || 'N/A'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider">Total Allocated Budget (₹)</label>
                  <input 
                    type="number"
                    required
                    value={newProject.totalAllocated}
                    onChange={e => setNewProject(prev => ({ ...prev, totalAllocated: e.target.value }))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider">Est. Completion Date</label>
                  <input 
                    type="date"
                    required
                    value={newProject.estimatedCompletionDate}
                    onChange={e => setNewProject(prev => ({ ...prev, estimatedCompletionDate: e.target.value }))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full text-white py-2 rounded font-semibold text-sm hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: '#0a0a0a' }}
                >
                  {loading ? 'Creating...' : 'Allocate Project'}
                </button>
              </form>
            </div>

            {/* Projects List */}
            <div className="w-full md:w-[65%] space-y-6">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Infrastructure Project Allocations</h3>
              {projects.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-400">
                  No projects allocated yet. Use the allocation form to create one.
                </div>
              ) : (
                projects.map(proj => (
                  <div key={proj._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                    
                    {/* Top Banner for Title & Status */}
                    <div className="px-6 py-4 border-b border-gray-150 bg-gray-50/50 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 tracking-tight">{proj.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Jurisdiction: <span className="font-semibold text-gray-700">{proj.villageId?.name}</span> ({proj.villageId?.district})
                        </p>
                      </div>
                      <span 
                        className="px-2.5 py-1 text-xs font-bold rounded-md border tracking-wider uppercase whitespace-nowrap"
                        style={{
                          backgroundColor: 
                            proj.status === 'Admin Approved' ? '#DEF7EC' :
                            proj.status === 'Red Flagged' ? '#FDE8E8' :
                            proj.status === 'Head Completed' ? '#FEF08A' :
                            '#E1EFFE',
                          borderColor: 
                            proj.status === 'Admin Approved' ? '#31C48D' :
                            proj.status === 'Red Flagged' ? '#F98080' :
                            proj.status === 'Head Completed' ? '#FACC15' :
                            '#76A9FA',
                          color: 
                            proj.status === 'Admin Approved' ? '#03543F' :
                            proj.status === 'Red Flagged' ? '#9B1C1C' :
                            proj.status === 'Head Completed' ? '#713F12' :
                            '#1E429F'
                        }}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Description */}
                      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-lg border border-gray-100">{proj.description}</p>

                      {/* Project Info Columns (Head, End Date, Verdict) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Assigned Head</span>
                          <p className="font-semibold text-gray-800 mt-1">{proj.assignedVillageHead?.name || 'Unassigned'}</p>
                          <p className="text-gray-500 mt-0.5 text-[10px]">{proj.assignedVillageHead?.email}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target Deadline</span>
                          <p className="font-semibold text-gray-800 mt-1">{new Date(proj.estimatedCompletionDate).toLocaleDateString()}</p>
                          <p className="text-gray-500 mt-0.5 text-[10px]">Estimated end date</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Community Audit</span>
                          <p className="font-semibold text-gray-800 mt-1">
                            {proj.approvalVotes?.length || 0} Yes / {proj.disputeVotes?.length || 0} Disputes
                          </p>
                          <p className="text-gray-500 mt-0.5 text-[10px]">Citizen reviews consensus</p>
                        </div>
                      </div>

                      {/* Budget Numbers (Progress Bar + Cards) */}
                      <div className="pt-2 space-y-3">
                        <div className="grid grid-cols-3 gap-4 border border-gray-150 rounded-lg p-3 bg-gray-50/50">
                          <div className="text-center">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Allocated</span>
                            <p className="text-xs font-bold text-gray-800 mt-1">₹{proj.budget?.totalAllocated?.toLocaleString('en-IN')}</p>
                          </div>
                          <div className="text-center border-l border-gray-200">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block text-green-600">Released</span>
                            <p className="text-xs font-bold text-green-600 mt-1">₹{proj.budget?.releasedAmount?.toLocaleString('en-IN')}</p>
                          </div>
                          <div className="text-center border-l border-gray-200">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block text-red-500">Remaining</span>
                            <p className="text-xs font-bold text-red-500 mt-1">₹{proj.budget?.pendingAmount?.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            <span>Funding Progress</span>
                            <span>{Math.round(((proj.budget?.releasedAmount || 0) / (proj.budget?.totalAllocated || 1)) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min(100, Math.round(((proj.budget?.releasedAmount || 0) / (proj.budget?.totalAllocated || 1)) * 100))}%`,
                                backgroundColor: '#0052FF' 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Proof of Work */}
                      {proj.proofOfWorkImages && proj.proofOfWorkImages.length > 0 && (
                        <div className="pt-2">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Submitted Proofs</span>
                          <div className="flex gap-2 flex-wrap">
                            {proj.proofOfWorkImages.map((img, i) => (
                              <a href={img} target="_blank" rel="noreferrer" key={i} className="block border border-gray-200 rounded-lg p-1 hover:border-gray-400 transition-colors">
                                <img src={img} alt="proof" className="w-16 h-16 object-cover rounded-md" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Bar (Aligned nicely and spaced) */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      {/* Release Funds Action */}
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-xs font-bold text-gray-500 whitespace-nowrap uppercase tracking-wider">Release Fund:</span>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs text-gray-400">₹</span>
                          <input 
                            type="number"
                            placeholder="Enter amount"
                            value={releaseAmounts[proj._id] || ''}
                            onChange={e => setReleaseAmounts(prev => ({ ...prev, [proj._id]: e.target.value }))}
                            className="pl-7 pr-3 py-1.5 border border-gray-300 rounded-md text-xs w-32 focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white"
                          />
                        </div>
                        <button 
                          onClick={() => handleReleaseBudget(proj._id)}
                          className="text-white text-xs px-4 py-1.5 rounded font-semibold cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#0052FF' }}
                        >
                          Release
                        </button>
                      </div>

                      {/* Status Actions */}
                      <div className="flex gap-2 w-full md:w-auto justify-end">
                        <button 
                          onClick={() => handleUpdateStatus(proj._id, 'Admin Approved')}
                          className="text-white text-xs px-3 py-1.5 rounded font-semibold cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#0a0a0a' }}
                        >
                          Approve Milestone
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(proj._id, 'Red Flagged')}
                          className="text-white text-xs px-3 py-1.5 rounded font-semibold cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#DC2626' }}
                        >
                          Red Flag Project
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab Contents: Disputes / Tickets */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Disputes & Support Tickets</h3>
            {tickets.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-400">
                No tickets or disputes submitted yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {tickets.map(ticket => (
                  <div key={ticket._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 text-xs font-bold rounded border uppercase">
                          {ticket.category}
                        </span>
                        <h4 className="text-base font-bold text-gray-900 mt-2">
                          Objection on: {ticket.projectId?.title || 'Deleted Project'}
                        </h4>
                        <span className="text-xs text-gray-500">
                          Village: {ticket.projectId?.villageId?.name || 'N/A'} | Raised By: {ticket.raisedBy?.name || 'Anonymous citizen'} ({ticket.raisedBy?.email})
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded border uppercase ${
                        ticket.status === 'Resolved' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700 animate-pulse'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded border border-gray-100 text-sm text-gray-700 leading-relaxed">
                      <strong>Issue Details:</strong> {ticket.description}
                    </div>

                    {ticket.status === 'Resolved' ? (
                      <div className="p-3 bg-green-50/50 rounded border border-green-100 text-sm text-green-800">
                        <strong>Admin Resolution Response:</strong> {ticket.adminResponse}
                      </div>
                    ) : (
                      <div className="space-y-3 pt-2">
                        <label className="block text-xs font-bold uppercase text-gray-500">Write Action Resolution Response</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="Explain the admin action taken to close this ticket..."
                            value={ticketResponses[ticket._id] || ''}
                            onChange={e => setTicketResponses(prev => ({ ...prev, [ticket._id]: e.target.value }))}
                            className="flex-grow p-2 border border-gray-300 rounded text-sm focus:outline-none"
                          />
                          <button 
                            onClick={() => handleResolveTicket(ticket._id)}
                            className="bg-brand-black hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded text-sm cursor-pointer"
                          >
                            Resolve & Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
