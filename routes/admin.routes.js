const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const Project = require("../models/Project.js");
const Ticket = require("../models/Ticket.js");
const Village = require("../models/Village.js");
const { isLoggedIn, isAdmin } = require("../middleware");
const { auditProjectRisk } = require("../services/riskAgent.js");

// 1. GET: Fetch all projects across all villages for District Administration
router.get("/projects", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const projects = await Project.find().populate("village", "name district state registeredCitizensCount");
        res.status(200).json({ projects });
    } catch (err) {
        console.error("Admin fetch projects error:", err);
        res.status(500).json({ message: "Server error fetching projects" });
    }
});

// 2. POST: Register a new public infrastructure project with milestone tranches
router.post("/projects", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { title, description, villageId, totalBudget, contractorName, milestones } = req.body;

        if (!title || !description || !villageId || !totalBudget || !contractorName) {
            return res.status(400).json({ message: "All required project fields (title, description, villageId, totalBudget, contractorName) must be provided" });
        }

        const village = await Village.findById(villageId);
        if (!village) {
            return res.status(404).json({ message: "Designated village jurisdiction not found" });
        }

        // Format milestones or provide standard tranches if empty
        const formattedMilestones = (Array.isArray(milestones) && milestones.length > 0)
            ? milestones
            : [
                { title: "Tranche 1: Foundation & Material Procurement", amount: Math.round(totalBudget * 0.3), status: "Pending", proofUrl: "" },
                { title: "Tranche 2: Structural Framing & Construction", amount: Math.round(totalBudget * 0.4), status: "Pending", proofUrl: "" },
                { title: "Tranche 3: Finishing & Final Public Inspection", amount: Math.round(totalBudget * 0.3), status: "Pending", proofUrl: "" }
            ];

        const newProject = new Project({
            title,
            description,
            village: villageId,
            totalBudget: Number(totalBudget),
            contractorName,
            status: "Active",
            milestones: formattedMilestones
        });

        await newProject.save();

        // Update allocated budget in Village model
        await Village.findByIdAndUpdate(villageId, { $inc: { budgetAllocated: Number(totalBudget) } });

        res.status(201).json({ message: "Project registered successfully", project: newProject });
    } catch (err) {
        console.error("Admin create project error:", err);
        res.status(500).json({ message: "Server error creating project" });
    }
});

// 3. GET: Fetch all villages & financial ledger totals
router.get("/villages", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const villages = await Village.find().populate("villageHead", "name username email phone");
        res.status(200).json({ villages });
    } catch (err) {
        console.error("Admin fetch villages error:", err);
        res.status(500).json({ message: "Server error fetching villages" });
    }
});

// 4. POST: Register a new Village / Panchayat Jurisdiction
router.post("/villages", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { name, district, state } = req.body;
        if (!name || !district || !state) {
            return res.status(400).json({ message: "Village name, district, and state are required" });
        }

        const existingVillage = await Village.findOne({ name });
        if (existingVillage) {
            return res.status(400).json({ message: "A village with this name already exists" });
        }

        const village = new Village({
            name,
            district,
            state,
            registeredCitizensCount: 0
        });
        await village.save();

        res.status(201).json({ message: "Village registered successfully", village });
    } catch (err) {
        console.error("Admin create village error:", err);
        res.status(500).json({ message: "Server error creating village" });
    }
});

// 5. GET: Fetch all disputes across all projects
router.get("/tickets", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate("citizen", "username name email")
            .populate({
                path: "project",
                select: "title status village totalBudget",
                populate: { path: "village", select: "name registeredCitizensCount" }
            })
            .sort({ createdAt: -1 });
        res.status(200).json({ tickets });
    } catch (err) {
        console.error("Admin fetch tickets error:", err);
        res.status(500).json({ message: "Server error fetching disputes" });
    }
});

// 6. PUT: Resolve a dispute (Admin only) & calculate 50% halt restoration
router.put("/tickets/:ticketId/resolve", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Dispute not found" });
        }

        ticket.status = "Resolved";
        await ticket.save();

        // Halt Protocol Check: Get total village citizen count
        const project = await Project.findById(ticket.project);
        if (project) {
            const activeTickets = await Ticket.find({ project: project._id, status: { $ne: "Resolved" } });
            const village = await Village.findById(project.village);
            const totalCitizens = (village && village.registeredCitizensCount) ? village.registeredCitizensCount : 1;

            // Verify if any remaining active disputes still exceed the 50% upvotes threshold
            let shouldResume = true;
            for (let activeTicket of activeTickets) {
                if ((activeTicket.upvotes.length / totalCitizens) > 0.5) {
                    shouldResume = false;
                    break;
                }
            }

            // If no remaining active dispute exceeds 50%, restore project to Active
            let projectStatus = project.status;
            if (shouldResume && project.status === "Halted") {
                projectStatus = "Active";
                await Project.findByIdAndUpdate(project._id, { status: "Active" });
            }

            res.status(200).json({
                message: "Dispute marked as resolved. Community halt protocol re-evaluated.",
                ticket,
                projectStatus
            });
        } else {
            res.status(200).json({ message: "Dispute resolved", ticket });
        }
    } catch (err) {
        console.error("Resolve dispute error:", err);
        res.status(500).json({ message: "Server error resolving dispute" });
    }
});

// 7. PUT: Approve & Disburse milestone funds
router.put("/projects/:projectId/milestones/:milestoneId/disburse", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { projectId, milestoneId } = req.params;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.status === "Halted") {
            return res.status(400).json({ message: "Cannot disburse funds while project is HALTED by citizen consensus" });
        }

        const milestone = project.milestones.id(milestoneId);
        if (!milestone) {
            return res.status(404).json({ message: "Milestone not found" });
        }

        if (milestone.status === "Disbursed") {
            return res.status(400).json({ message: "Milestone tranche has already been disbursed" });
        }

        milestone.status = "Disbursed";
        project.disbursedBudget = (project.disbursedBudget || 0) + milestone.amount;

        // Check if all milestones are disbursed -> complete project
        const allCompleted = project.milestones.every(m => m.status === "Disbursed");
        if (allCompleted) {
            project.status = "Completed";
        }

        await project.save();

        // Update Village spent budget
        await Village.findByIdAndUpdate(project.village, { $inc: { budgetSpent: milestone.amount } });

        res.status(200).json({
            message: `Milestone funds (${milestone.amount} INR) authorized and disbursed to contractor.`,
            project
        });
    } catch (err) {
        console.error("Disburse milestone error:", err);
        res.status(500).json({ message: "Server error disbursing milestone" });
    }
});

// 8. GET: Trigger LangGraph AI Risk Audit for a specific project
router.get("/ai/audit/:projectId", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const village = await Village.findById(project.village);
        const tickets = await Ticket.find({ project: projectId }).populate("citizen", "username");

        const riskReport = await auditProjectRisk(project, village, tickets);
        res.status(200).json({
            projectId: project._id,
            projectTitle: project.title,
            riskReport
        });
    } catch (err) {
        console.error("AI Audit error:", err);
        res.status(500).json({ message: "Server error conducting AI risk audit" });
    }
});

// 9. GET: Batch AI Risk Overview across all projects
router.get("/ai/overview", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const projects = await Project.find().populate("village");
        const reports = [];

        for (let proj of projects) {
            const tickets = await Ticket.find({ project: proj._id });
            const riskReport = await auditProjectRisk(proj, proj.village, tickets);
            reports.push({
                projectId: proj._id,
                projectTitle: proj.title,
                villageName: proj.village?.name || "Panchayat",
                status: proj.status,
                riskReport
            });
        }

        res.status(200).json({ reports });
    } catch (err) {
        console.error("AI Overview error:", err);
        res.status(500).json({ message: "Server error generating AI overview" });
    }
});

module.exports = router;
