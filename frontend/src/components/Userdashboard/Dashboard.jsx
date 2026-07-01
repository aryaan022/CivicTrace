import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import ProjectsList from './ProjectsList';
import DisputesList from './DisputesList';
import RaiseDisputeForm from './RaiseDisputeForm';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, projects, disputes, raise
  const [projects, setProjects] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state for raising a new dispute
  const [newDispute, setNewDispute] = useState({
    projectId: "",
    title: "",
    description: ""
  });

  // Fetch real data from the backend APIs
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch projects in the user's village
      const projectsRes = await fetch("/api/user/projects", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const projectsData = await projectsRes.json();

      // Fetch active disputes in the user's village
      const ticketsRes = await fetch("/api/user/tickets", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const ticketsData = await ticketsRes.json();

      if (projectsRes.ok) {
        const formattedProjects = (projectsData.projects || []).map(p => ({
          id: p._id,
          title: p.title,
          description: p.description,
          budget: p.totalBudget,
          status: p.status,
          contractorName: p.contractorName,
          disputesCount: p.disputesCount || 0,
          milestones: (p.milestones || []).map(m => ({
            id: m._id,
            title: m.title,
            amount: m.amount,
            status: m.status,
            proofUrl: m.proofUrl
          }))
        }));
        setProjects(formattedProjects);

        // Pre-select first project for dispute creation if not already set
        if (formattedProjects.length > 0) {
          setNewDispute(prev => ({
            ...prev,
            projectId: prev.projectId || formattedProjects[0].id
          }));
        }
      }

      if (ticketsRes.ok) {
        const formattedDisputes = (ticketsData.tickets || []).map(t => {
          const currentUserId = user?.id || user?._id;
          const hasVoted = t.upvotes?.some(id => id.toString() === currentUserId?.toString());
          
          return {
            id: t._id,
            projectId: t.project?._id,
            projectTitle: t.project?.title || "Panchayat Work",
            title: t.title,
            description: t.description,
            citizenName: t.citizen?.username || "Citizen Auditor",
            upvotes: t.upvotes?.length || 0,
            hasVoted: !!hasVoted,
            status: t.status
          };
        });
        setDisputes(formattedDisputes);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Handle upvoting from the database
  const handleUpvote = async (disputeId) => {
    try {
      const response = await fetch(`/api/user/tickets/${disputeId}/upvote`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        // Real-time synchronization of state from server
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to record vote");
      }
    } catch (err) {
      console.error("Upvote API error:", err);
    }
  };

  // Submit raised dispute to backend
  const handleCreateDisputeSubmit = async (e) => {
    e.preventDefault();
    if (!newDispute.projectId || !newDispute.title || !newDispute.description) {
      alert("All fields are required to raise a dispute.");
      return;
    }

    try {
      const response = await fetch("/api/user/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          projectId: newDispute.projectId,
          title: newDispute.title,
          description: newDispute.description
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert("Dispute submitted successfully!");
        fetchDashboardData();
        
        // Reset form details
        setNewDispute(prev => ({
          projectId: projects[0]?.id || "",
          title: "",
          description: ""
        }));
        
        // Transition view back to disputes list
        setActiveTab('disputes');
      } else {
        alert(data.message || "Failed to submit dispute");
      }
    } catch (err) {
      console.error("Submit dispute error:", err);
      alert("Connection failure trying to raise dispute");
    }
  };

  // Calculate statistics from database state
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const haltedProjectsCount = projects.filter(p => p.status === "Halted").length;
  const activeDisputesCount = disputes.filter(d => d.status !== "Resolved").length;

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center bg-[#0b0f19] text-slate-400 text-xs uppercase tracking-widest min-h-[400px]">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping mr-2.5"></span>
        Syncing Citizen Ledger...
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
        activeDisputesCount={activeDisputesCount}
      />

      {/* Main Panel */}
      <main className="flex-1 bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-lg min-h-[500px]">
        
        {activeTab === 'overview' && (
          <Overview 
            totalBudget={totalBudget}
            activeDisputesCount={activeDisputesCount}
            haltedProjectsCount={haltedProjectsCount}
            projects={projects}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsList 
            projects={projects}
          />
        )}

        {activeTab === 'disputes' && (
          <DisputesList 
            disputes={disputes}
            handleUpvote={handleUpvote}
          />
        )}

        {activeTab === 'raise' && (
          <RaiseDisputeForm 
            newDispute={newDispute}
            setNewDispute={setNewDispute}
            projects={projects}
            handleCreateDisputeSubmit={handleCreateDisputeSubmit}
          />
        )}

      </main>

    </div>
  );
}
