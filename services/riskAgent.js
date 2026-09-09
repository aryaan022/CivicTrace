/**
 * CivicTrace Multi-Agent Risk & Anomaly Detection Pipeline
 * Implements LangGraph StateGraph workflow for Grassroots Infrastructure Audits
 */

const { StateGraph, Annotation, END, START } = require("@langchain/langgraph");

// Define Agent State Schema using LangGraph Annotation
const RiskAuditState = Annotation.Root({
    project: Annotation({
        reducer: (curr, next) => next || curr,
        default: () => null
    }),
    village: Annotation({
        reducer: (curr, next) => next || curr,
        default: () => null
    }),
    tickets: Annotation({
        reducer: (curr, next) => next || curr,
        default: () => []
    }),
    disputeAnalysis: Annotation({
        reducer: (curr, next) => ({ ...curr, ...next }),
        default: () => ({})
    }),
    budgetAnalysis: Annotation({
        reducer: (curr, next) => ({ ...curr, ...next }),
        default: () => ({})
    }),
    synthesizedRisk: Annotation({
        reducer: (curr, next) => ({ ...curr, ...next }),
        default: () => ({})
    })
});

/**
 * Node 1: Citizen Dispute Velocity & Sentiment Analysis Agent
 * Analyzes grievance patterns, recurring defect keywords, and upvote-to-citizen ratios.
 */
async function disputeVelocityAgent(state) {
    const { tickets, village, project } = state;
    const totalCitizens = (village && village.registeredCitizensCount) ? village.registeredCitizensCount : 1;
    const openTickets = (tickets || []).filter(t => t.status !== "Resolved");
    
    let totalUpvotes = 0;
    let criticalKeywordsCount = 0;
    const criticalKeywords = ["crack", "cement", "substandard", "collapse", "fake", "bribe", "poor quality", "unpaved", "leak", "broken", "danger", "delay"];
    
    const flaggedTickets = [];

    openTickets.forEach(t => {
        const upvoteCount = Array.isArray(t.upvotes) ? t.upvotes.length : 0;
        totalUpvotes += upvoteCount;
        
        const combinedText = `${t.title} ${t.description}`.toLowerCase();
        const matches = criticalKeywords.filter(kw => combinedText.includes(kw));
        
        if (matches.length > 0 || (upvoteCount / totalCitizens) > 0.25) {
            flaggedTickets.push({
                id: t._id || t.id,
                title: t.title,
                upvoteRatio: Math.min(1, upvoteCount / totalCitizens),
                triggers: matches
            });
        }
        criticalKeywordsCount += matches.length;
    });

    const citizenDissatisfactionRate = totalCitizens > 0 ? (totalUpvotes / totalCitizens) : 0;
    const grievanceVelocity = openTickets.length >= 3 ? "High" : openTickets.length >= 1 ? "Moderate" : "Low";
    
    // Calculate dispute score (0 - 100)
    let disputeScore = (citizenDissatisfactionRate * 50) + (openTickets.length * 10) + (criticalKeywordsCount * 5);
    disputeScore = Math.min(100, Math.max(0, Math.round(disputeScore)));

    return {
        disputeAnalysis: {
            openTicketsCount: openTickets.length,
            totalUpvotes,
            citizenDissatisfactionRate: Math.round(citizenDissatisfactionRate * 100) / 100,
            grievanceVelocity,
            flaggedTickets,
            disputeScore
        }
    };
}

/**
 * Node 2: Budget Allocation & Milestone Proof Anomaly Agent
 * Examines milestone claim sequence, fund disbursement vs proof existence, and cost inflation.
 */
async function budgetAnomalyAgent(state) {
    const { project } = state;
    if (!project) {
        return { budgetAnalysis: { budgetScore: 0, anomalies: [] } };
    }

    const totalBudget = project.totalBudget || 1;
    const disbursedBudget = project.disbursedBudget || 0;
    const milestones = project.milestones || [];
    
    const anomalies = [];
    let unprovenMilestoneClaims = 0;
    let disbursedWithoutProof = 0;

    milestones.forEach((m, idx) => {
        const hasProof = m.proofUrl && m.proofUrl.trim().length > 5;
        if (m.status === "Approved" && !hasProof) {
            anomalies.push(`Milestone #${idx + 1} (${m.title}) is marked Approved but lacks valid photo verification.`);
            unprovenMilestoneClaims++;
        }
        if (m.status === "Disbursed" && !hasProof) {
            anomalies.push(`Milestone #${idx + 1} (${m.title}) funds were Disbursed without photographic proof.`);
            disbursedWithoutProof++;
        }
    });

    const disbursementRatio = totalBudget > 0 ? (disbursedBudget / totalBudget) : 0;
    
    if (project.status === "Halted" && disbursementRatio > 0.7) {
        anomalies.push("High fund release (>70%) on a currently Halted project under community investigation.");
    }

    let budgetScore = (disbursedWithoutProof * 30) + (unprovenMilestoneClaims * 15);
    if (project.status === "Halted") budgetScore += 25;
    budgetScore = Math.min(100, Math.max(0, Math.round(budgetScore)));

    return {
        budgetAnalysis: {
            disbursementRatio: Math.round(disbursementRatio * 100) / 100,
            unprovenMilestonesCount: unprovenMilestoneClaims,
            disbursedWithoutProof,
            anomalies,
            budgetScore
        }
    };
}

/**
 * Node 3: Synthesis & Action Recommendation Agent
 * Combines signals into composite audit score and actionable directives.
 */
async function riskSynthesizerAgent(state) {
    const { project, village, disputeAnalysis, budgetAnalysis } = state;
    
    const dScore = (disputeAnalysis && disputeAnalysis.disputeScore) || 0;
    const bScore = (budgetAnalysis && budgetAnalysis.budgetScore) || 0;
    
    // Composite weighted score (55% dispute/community feedback, 45% financial/proof integrity)
    const compositeScore = Math.min(100, Math.round((dScore * 0.55) + (bScore * 0.45)));
    
    let riskLevel = "Low";
    if (compositeScore >= 70 || project.status === "Halted") {
        riskLevel = "Critical";
    } else if (compositeScore >= 45) {
        riskLevel = "High";
    } else if (compositeScore >= 20) {
        riskLevel = "Medium";
    }

    const flagReasons = [];
    const recommendedActions = [];

    if (project.status === "Halted") {
        flagReasons.push("Project is currently under automatic community lock (>50% citizen consensus halt).");
        recommendedActions.push("Dispatch district quality inspection team to conduct on-site core sampling.");
    }
    if (disputeAnalysis.openTicketsCount > 0) {
        flagReasons.push(`${disputeAnalysis.openTicketsCount} active citizen dispute tickets filed against construction.`);
    }
    if (disputeAnalysis.citizenDissatisfactionRate > 0.3) {
        flagReasons.push(`High citizen friction: ${(disputeAnalysis.citizenDissatisfactionRate * 100).toFixed(0)}% citizen upvote engagement.`);
        recommendedActions.push("Convene Gram Sabha public audit hearing with Panchayat Sarpanch and contractor.");
    }
    if (budgetAnalysis.unprovenMilestonesCount > 0) {
        flagReasons.push(`${budgetAnalysis.unprovenMilestonesCount} milestone claims submitted without visual verification.`);
        recommendedActions.push("Freeze upcoming payment tranche until geotagged site photos are validated.");
    }
    if (budgetAnalysis.anomalies.length > 0) {
        budgetAnalysis.anomalies.forEach(a => flagReasons.push(a));
    }

    if (recommendedActions.length === 0) {
        recommendedActions.push("Project metrics within normal parameters. Routine spot inspections recommended.");
    }

    const summary = `Risk audit for '${project.title}' in ${village ? village.name : 'jurisdiction'} rated ${riskLevel.toUpperCase()} (Audit Score: ${compositeScore}/100). ${flagReasons.length > 0 ? flagReasons[0] : 'No high anomalies detected.'}`;

    return {
        synthesizedRisk: {
            riskLevel,
            compositeScore,
            summary,
            flagReasons,
            recommendedActions,
            timestamp: new Date().toISOString()
        }
    };
}

// Construct and compile the LangGraph StateGraph Workflow
function buildRiskAuditGraph() {
    const workflow = new StateGraph(RiskAuditState)
        .addNode("disputeVelocityAgent", disputeVelocityAgent)
        .addNode("budgetAnomalyAgent", budgetAnomalyAgent)
        .addNode("riskSynthesizerAgent", riskSynthesizerAgent)
        .addEdge(START, "disputeVelocityAgent")
        .addEdge("disputeVelocityAgent", "budgetAnomalyAgent")
        .addEdge("budgetAnomalyAgent", "riskSynthesizerAgent")
        .addEdge("riskSynthesizerAgent", END);

    return workflow.compile();
}

/**
 * Executes the compiled LangGraph workflow on project and village audit data
 */
async function auditProjectRisk(projectData, villageData, ticketsData) {
    try {
        const app = buildRiskAuditGraph();
        const finalState = await app.invoke({
            project: projectData,
            village: villageData,
            tickets: ticketsData
        });
        return finalState.synthesizedRisk;
    } catch (err) {
        console.error("LangGraph Agent execution error:", err);
        // Fallback robust evaluator
        return {
            riskLevel: projectData.status === "Halted" ? "Critical" : "Medium",
            compositeScore: projectData.status === "Halted" ? 85 : 35,
            summary: `Automated assessment for ${projectData.title}`,
            flagReasons: projectData.status === "Halted" ? ["Community consensus halt active"] : ["Standard monitoring"],
            recommendedActions: ["Review project site verification proofs"],
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = {
    auditProjectRisk,
    buildRiskAuditGraph
};
