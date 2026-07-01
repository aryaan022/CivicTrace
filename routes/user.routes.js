const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const Project = require("../models/Project.js");
const Ticket = require("../models/Ticket.js");
const Village = require("../models/Village.js");
const { isLoggedIn } = require("../middleware");

//get /api/user/dahsboard

router.get("/dashboard",isLoggedIn,async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"Dashboard data retrived succcessfully",user:{
            id:user._id,
            name:user.name,
            username:user.username,
            email:user.email,
            phone:user.phone,
            role:user.role
        }});
    }catch(err){
        console.error("Dashboard route error",err);
        res.status(500).json({message:"Internal server error"});
    }
});


// 2. GET all Projects in User's Village
router.get("/projects", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.village) {
            return res.status(400).json({ message: "User has no assigned village" });
        }
        // Fetch all projects belonging to the user's village
        const projects = await Project.find({ village: user.village });
        res.status(200).json({ projects });
    } catch (err) {
        console.error("Fetch projects error:", err);
        res.status(500).json({ message: "Server error" });
    }
});


// 3. GET all disputes in User's Village
router.get("/tickets", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.village) {
            return res.status(400).json({ message: "User has no assigned village" });
        }

        // Find projects in user's village
        const projects = await Project.find({ village: user.village }).select("_id");

        const projectIds = projects.map(p => p._id);

        // Fetch all disputes for those projects, populating details
        const tickets = await Ticket.find({ project: { $in: projectIds } })
            .populate("citizen", "username")
            .populate("project", "title");
        res.status(200).json({ tickets });
    } catch (err) {
        console.error("Fetch tickets error:", err);
        res.status(500).json({ message: "Server error" });
    }
});


// 4. POST file a new audit dispute
router.post("/tickets", isLoggedIn, async (req, res) => {
    try {
        const { projectId, title, description } = req.body;
        if (!projectId || !title || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newTicket = new Ticket({
            project: projectId,
            citizen: req.user.id,
            title,
            description,
            upvotes: [req.user.id] // Auto-upvote by author
        });
        await newTicket.save();
        // Increment disputes count on Project
        await Project.findByIdAndUpdate(projectId, { $inc: { disputesCount: 1 } });
        res.status(201).json({ message: "Dispute submitted successfully", ticket: newTicket });
    } catch (err) {
        console.error("File dispute error:", err);
        res.status(500).json({ message: "Server error" });
    }
});



// 5. PUT upvote dispute & execute Automatic Halt check
router.put("/tickets/:ticketId/upvote", isLoggedIn, async (req, res) => {
    try {
        const { ticketId } = req.params;
        const userId = req.user.id;
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Dispute not found" });
        }
        // Toggle Upvote logic
        const hasVoted = ticket.upvotes.includes(userId);
        if (hasVoted) {
            ticket.upvotes = ticket.upvotes.filter(id => id.toString() !== userId);
        } else {
            ticket.upvotes.push(userId);
        }
        await ticket.save();


        // Halt Protocol Check: Get total village citizen count
        const project = await Project.findById(ticket.project);
        const village = await Village.findById(project.village);
        const totalCitizens = village.registeredCitizensCount || 1; // avoid divide by zero
        const totalUpvotes = ticket.upvotes.length;


        // If upvotes on this active dispute exceed 50% of registered citizens, halt the project!
        let projectStatus = project.status;
        if (totalUpvotes / totalCitizens > 0.5) {
            projectStatus = "Halted";
            await Project.findByIdAndUpdate(ticket.project, { status: "Halted" });
        }
        res.status(200).json({
            message: hasVoted ? "Upvote removed" : "Upvote recorded",
            ticket: {
                id: ticket._id,
                upvotes: ticket.upvotes.length,
                hasVoted: !hasVoted,
                status: ticket.status
            },
            projectStatus
        });
    } catch (err) {
        console.error("Upvote error:", err);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;