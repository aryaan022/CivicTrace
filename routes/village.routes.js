const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const Project = require("../models/Project.js");
const Village = require("../models/Village.js");
const { isLoggedIn, isVillageHead } = require("../middleware");

// 1. PUT: Upload proof of work for a project milestone tranche
router.put("/projects/:projectId/milestones/:milestoneId/proof", isLoggedIn, isVillageHead, async(req, res) => {
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
        milestone.status = "Pending"; // Set to Pending for citizen voting
        await project.save();
        res.status(200).json({ message: "Milestone proof uploaded successfully", project });
    } catch (err) {
        console.error("Proof upload error:", err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
