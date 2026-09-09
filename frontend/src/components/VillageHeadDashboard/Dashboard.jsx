import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import MilestoneProofs from './MilestoneProofs';
import DisputesList from './DisputesList';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [registeredCitizensCount, setRegisteredCitizensCount] = useState(0);
  const [villageInfo, setVillageInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch village projects, disputes, and citizen count from the server
  const fetchDashboardData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };

      // Fetch village info, projects, and disputes in parallel
      const [villageRes, projectsRes, ticketsRes] = await Promise.all([
        fetch("/api/village/my-village", { headers }),
        fetch("/api/village/projects", { headers }),
        fetch("/api/village/tickets", { headers })
      ]);

      const villageData = await villageRes.json();
      const projectsData = await projectsRes.json();
      const ticketsData = await ticketsRes.json();

      if (villageRes.ok && villageData.village) {
        setVillageInfo(villageData.village);
        setRegisteredCitizensCount(villageData.village.registeredCitizensCount || 0);
      }

      if (projectsRes.ok) {
        const formattedProjects = (projectsData.projects || []).map(p => ({
          id: p._id,
          title: p.title,
          description: p.description,
          budget: p.totalBudget,
          status: p.status,
          contractorName: p.contractorName,
          milestones: (p.milestones || []).map(m => ({
            id: m._id,
            title: m.title,
            amount: m.amount,
            status: m.status,
            proofUrl: m.proofUrl
          }))
        }));
        setProjects(formattedProjects);
      }

      if (ticketsRes.ok) {
        const formattedDisputes = (ticketsData.tickets || []).map(t => ({
          id: t._id,
          projectTitle: t.project?.title || "Panchayat Work",
          title: t.title,
          description: t.description,
          status: t.status,
          citizenName: t.citizen?.username || "Citizen Auditor",
          upvotes: t.upvotes?.length || 0
        }));
        setDisputes(formattedDisputes);
      }
    } catch (err) {
      console.error("Village Head dashboard retrieval error:", err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Real-time live synchronization polling
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Upload proof of work PUT request to the backend
  const handleUploadProof = async (projectId, milestoneId, proofUrl) => {
    try {
      const response = await fetch(`/api/village/projects/${projectId}/milestones/${milestoneId}/proof`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ proofUrl })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Milestone proof submitted successfully! Citizens and Admins can now audit it.");
        fetchDashboardData(true);
        return true;
      } else {
        alert(data.message || "Failed to upload proof");
        return false;
      }
    } catch (err) {
      console.error("Proof submission error:", err);
      alert("Server error connecting to upload proof");
      return false;
    }
  };

  // Calculate statistics
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const budgetSpent = projects.reduce((acc, p) => {
    const disbursed = p.milestones.filter(m => m.status === "Disbursed").reduce((sum, m) => sum + m.amount, 0);
    return acc + disbursed;
  }, 0);
  const haltedProjectsCount = projects.filter(p => p.status === "Halted").length;
  const activeDisputesCount = disputes.filter(d => d.status !== "Resolved").length;

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center bg-[#0b0f19] text-slate-400 text-xs uppercase tracking-widest min-h-[400px]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-2.5"></span>
        Syncing Sarpanch Console ({villageInfo?.name || 'Local Panchayat'})...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#0b0f19] text-slate-100 max-w-6xl w-full mx-auto p-4 md:p-6 gap-6 relative z-10">
      {/* Sidebar Component */}
      <Sidebar 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      {/* Main Panel */}
      <main className="flex-1 bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-lg min-h-[500px]">
        {activeTab === 'overview' && (
          <Overview 
            totalBudget={totalBudget}
            budgetSpent={budgetSpent}
            registeredCitizensCount={registeredCitizensCount}
            projects={projects}
            haltedProjectsCount={haltedProjectsCount}
            activeDisputesCount={activeDisputesCount}
          />
        )}

        {activeTab === 'proofs' && (
          <MilestoneProofs 
            projects={projects}
            onUploadProof={handleUploadProof}
          />
        )}

        {activeTab === 'disputes' && (
          <DisputesList 
            disputes={disputes}
            registeredCitizensCount={registeredCitizensCount}
          />
        )}
      </main>
    </div>
  );
}
