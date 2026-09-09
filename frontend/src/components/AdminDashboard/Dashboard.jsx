import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import ProjectsManager from './ProjectsManager';
import DisputesArbitration from './DisputesArbitration';
import MilestoneDisbursement from './MilestoneDisbursement';
import AiRiskCenter from './AiRiskCenter';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [villages, setVillages] = useState([]);
  const [aiReports, setAiReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAi, setLoadingAi] = useState(false);

  // Fetch full district data from the server
  const fetchAdminData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };

      // Parallel requests for optimal speed
      const [projectsRes, disputesRes, villagesRes] = await Promise.all([
        fetch("/api/admin/projects", { headers }),
        fetch("/api/admin/tickets", { headers }),
        fetch("/api/admin/villages", { headers })
      ]);

      const projectsData = await projectsRes.json();
      const disputesData = await disputesRes.json();
      const villagesData = await villagesRes.json();

      if (projectsRes.ok) setProjects(projectsData.projects || []);
      if (disputesRes.ok) setDisputes(disputesData.tickets || []);
      if (villagesRes.ok) setVillages(villagesData.villages || []);

      if (!isBackground) {
        fetchAiOverview();
      }
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const fetchAiOverview = async () => {
    try {
      setLoadingAi(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/ai/overview", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAiReports(data.reports || []);
      }
    } catch (err) {
      console.error("AI overview fetch error:", err);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAdminData();

    // Live Real-Time Background Synchronization every 6 seconds
    const interval = setInterval(() => {
      fetchAdminData(true);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Create new project handler
  const handleCreateProject = async (payload) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Project registered and milestone tranches initialized!");
        fetchAdminData();
        return true;
      } else {
        alert(data.message || "Failed to register project");
        return false;
      }
    } catch (err) {
      console.error("Create project error:", err);
      alert("Network error creating project");
      return false;
    }
  };

  // Dispute resolution handler
  const handleResolveDispute = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/tickets/${ticketId}/resolve`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Dispute resolved successfully!");
        fetchAdminData();
      } else {
        alert(data.message || "Failed to resolve dispute");
      }
    } catch (err) {
      console.error("Resolve dispute error:", err);
      alert("Network error resolving dispute");
    }
  };

  // Milestone disbursement handler
  const handleDisburseMilestone = async (projectId, milestoneId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/projects/${projectId}/milestones/${milestoneId}/disburse`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Milestone funds released to contractor!");
        fetchAdminData();
      } else {
        alert(data.message || "Failed to disburse milestone");
      }
    } catch (err) {
      console.error("Disburse error:", err);
      alert("Network error during disbursement");
    }
  };

  // Single project AI audit trigger
  const handleAuditSingleProject = async (projectId) => {
    try {
      setActiveTab('ai-risk');
      setLoadingAi(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/ai/audit/${projectId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        fetchAiOverview();
      }
    } catch (err) {
      console.error("Single project audit error:", err);
    } finally {
      setLoadingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center bg-[#0b0f19] text-slate-400 text-xs uppercase tracking-widest min-h-[400px]">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping mr-2.5"></span>
        Loading District Magistrate Audit Console...
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

      {/* Main Administrative Screen */}
      <main className="flex-1 bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-lg min-h-[500px]">
        {activeTab === 'overview' && (
          <Overview
            projects={projects}
            disputes={disputes}
            villages={villages}
            aiReports={aiReports}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsManager
            projects={projects}
            villages={villages}
            onCreateProject={handleCreateProject}
            onAuditProject={handleAuditSingleProject}
          />
        )}

        {activeTab === 'disputes' && (
          <DisputesArbitration
            disputes={disputes}
            onResolveDispute={handleResolveDispute}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestoneDisbursement
            projects={projects}
            onDisburseMilestone={handleDisburseMilestone}
          />
        )}

        {activeTab === 'ai-risk' && (
          <AiRiskCenter
            aiReports={aiReports}
            onRefreshAiReports={fetchAiOverview}
            loadingAi={loadingAi}
          />
        )}
      </main>
    </div>
  );
}
