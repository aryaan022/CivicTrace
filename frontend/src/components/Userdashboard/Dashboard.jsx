import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import ProjectsList from './ProjectsList';
import DisputesList from './DisputesList';
import RaiseDisputeForm from './RaiseDisputeForm';

// Sample mock data showcasing the 50% dispute automatic halts in action
const INITIAL_PROJECTS = [
  {
    id: "p1",
    title: "Panchayat Ghar Renovation",
    description: "Renovation and waterproofing of the village panchayat administrative building.",
    budget: 500000,
    status: "Active",
    tranchesReleased: "2/3",
    disputesCount: 2,
    totalVotes: 8,
  },
  {
    id: "p2",
    title: "Solar Street Lights Installation",
    description: "Installing 50 LED solar streetlights across main village pathways.",
    budget: 250000,
    status: "Halted", // Automatic Halt triggered!
    tranchesReleased: "1/3",
    disputesCount: 7, // High disputes trigger halt
    totalVotes: 19,
  },
  {
    id: "p3",
    title: "Primary School Drinking Water Plant",
    description: "Setup of community RO drinking water filter system inside the school campus.",
    budget: 180000,
    status: "Completed",
    tranchesReleased: "3/3",
    disputesCount: 0,
    totalVotes: 0,
  }
];

const INITIAL_DISPUTES = [
  {
    id: "d1",
    projectId: "p2",
    projectTitle: "Solar Street Lights Installation",
    title: "Substandard battery quality",
    description: "The batteries supplied are generic and drain in 2 hours instead of lasting all night. Needs inspection.",
    citizenName: "Amit Kumar",
    upvotes: 12,
    hasVoted: false,
    status: "Active Review"
  },
  {
    id: "d2",
    projectId: "p2",
    projectTitle: "Solar Street Lights Installation",
    title: "Incorrect coordinates of pole installations",
    description: "5 poles have been installed inside private farmlands instead of public streets.",
    citizenName: "Sunita Devi",
    upvotes: 7,
    hasVoted: false,
    status: "Active Review"
  },
  {
    id: "d3",
    projectId: "p1",
    projectTitle: "Panchayat Ghar Renovation",
    title: "Delay in roof tiling milestone",
    description: "Roof concrete layer was completed 3 weeks ago but tiling works are still paused.",
    citizenName: "Rakesh Singh",
    upvotes: 3,
    hasVoted: false,
    status: "Resolved"
  }
];

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, projects, disputes, raise
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  
  // Form state for raising a new dispute
  const [newDispute, setNewDispute] = useState({
    projectId: "p1",
    title: "",
    description: ""
  });

  // Calculate statistics
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const haltedProjectsCount = projects.filter(p => p.status === "Halted").length;
  const activeDisputesCount = disputes.filter(d => d.status !== "Resolved").length;

  const handleUpvote = (disputeId) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === disputeId) {
        return {
          ...d,
          upvotes: d.hasVoted ? d.upvotes - 1 : d.upvotes + 1,
          hasVoted: !d.hasVoted
        };
      }
      return d;
    }));
  };

  const handleCreateDisputeSubmit = (e) => {
    e.preventDefault();
    if (!newDispute.title || !newDispute.description) return;

    const chosenProj = projects.find(p => p.id === newDispute.projectId);

    const disputeObj = {
      id: `d${disputes.length + 1}`,
      projectId: newDispute.projectId,
      projectTitle: chosenProj ? chosenProj.title : "General Audit",
      title: newDispute.title,
      description: newDispute.description,
      citizenName: user?.username || "Citizen Auditor",
      upvotes: 1,
      hasVoted: true,
      status: "Active Review"
    };

    setDisputes([disputeObj, ...disputes]);
    
    // Update project dispute count
    setProjects(prev => prev.map(p => {
      if (p.id === newDispute.projectId) {
        return {
          ...p,
          disputesCount: p.disputesCount + 1
        };
      }
      return p;
    }));

    // Reset Form
    setNewDispute({
      projectId: "p1",
      title: "",
      description: ""
    });

    // Redirect to disputes tab
    setActiveTab('disputes');
  };

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
