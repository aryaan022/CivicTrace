const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const Project = require("../models/Project.js");
const Ticket = require("../models/Ticket.js");
const Village = require("../models/Village.js");
const { isLoggedIn, isAdmin } = require("../middleware");

// PUT: Resolve a dispute (Admin only)
router.put("/tickets/:ticketId/resolve", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Dispute not found" });
        }

        // Mark the dispute as Resolved
        ticket.status = "Resolved";
        await ticket.save();

        // Halt Protocol Check: Get total village citizen count
        const project = await Project.findById(ticket.project);
        const activeTickets = await Ticket.find({ project: project._id, status: "Open" });
        const village = await Village.findById(project.village);
        const totalCitizens = village.registeredCitizensCount || 1;

        // Verify if any remaining active disputes still exceed the 50% upvotes threshold
        let shouldResume = true;
        for (let activeTicket of activeTickets) {
            if (activeTicket.upvotes.length / totalCitizens > 0.5) {
                shouldResume = false;
                break;
            }
        }

        // If no active disputes exceed the 50% limit, restore project status from Halted to Active
        let projectStatus = project.status;
        if (shouldResume && project.status === "Halted") {
            projectStatus = "Active";
            await Project.findByIdAndUpdate(project._id, { status: "Active" });
        }

        res.status(200).json({ 
            message: "Dispute resolved successfully by Admin", 
            ticket, 
            projectStatus 
        });
    } catch (err) {
        console.error("Resolve dispute error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
