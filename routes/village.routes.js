const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const Project = require("../models/Project.js");
const Ticket = require("../models/Ticket.js");
const Village = require("../models/Village.js");
const { isLoggedIn, isVillageHead } = require("../middleware");

// 1. GET: Fetch the village assigned to the logged-in Village Head
router.get("/my-village", isLoggedIn, isVillageHead, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("village");
        if (!user || !user.village) {
            return res.status(404).json({ message: "No village jurisdiction assigned to this Village Head account" });
        }
        res.status(200).json({ village: user.village });
    } catch (err) {
        console.error("Fetch my village error:", err);
        res.status(500).json({ message: "Server error fetching village data" });
    }
});

// 2. GET: Fetch all projects for this village
router.get("/projects", isLoggedIn, isVillageHead, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.village) {
            return res.status(400).json({ message: "Village head is not assigned to any village" });
        }
        const projects = await Project.find({ village: user.village }).populate("village", "name district state");
        res.status(200).json({ projects });
    } catch (err) {
        console.error("Fetch village head projects error:", err);
        res.status(500).json({ message: "Server error fetching projects" });
    }
});

// 3. GET: Fetch all disputes for this village
router.get("/tickets", isLoggedIn, isVillageHead, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.village) {
            return res.status(400).json({ message: "Village head is not assigned to any village" });
        }
        const projects = await Project.find({ village: user.village }).select("_id");
        const projectIds = projects.map(p => p._id);
        const tickets = await Ticket.find({ project: { $in: projectIds } })
            .populate("citizen", "username name")
            .populate("project", "title status");
        res.status(200).json({ tickets });
    } catch (err) {
        console.error("Fetch village tickets error:", err);
        res.status(500).json({ message: "Server error fetching tickets" });
    }
});

// 4. PUT: Upload proof of work for a project milestone tranche
router.put("/projects/:projectId/milestones/:milestoneId/proof", isLoggedIn, isVillageHead, async (req, res) => {
    try {
        const { projectId, milestoneId } = req.params;
        const { proofUrl } = req.body;
        if (!proofUrl) {
            return res.status(400).json({ message: "Proof URL is required" });
        }
        const user = await User.findById(req.user.id);
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Verify this Village Head represents the project's village
        if (project.village.toString() !== user.village?.toString()) {
            return res.status(403).json({ message: "You do not have permission to manage this project" });
        }

        const milestone = project.milestones.id(milestoneId);
        if (!milestone) {
            return res.status(404).json({ message: "Milestone not found" });
        }

        milestone.proofUrl = proofUrl;
        milestone.status = "Pending";
        await project.save();
        res.status(200).json({ message: "Milestone proof uploaded successfully", project });
    } catch (err) {
        console.error("Proof upload error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
