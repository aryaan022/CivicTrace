require('dotenv').config();
const express = require("express");
const app = express();
const  path = require("path");
const mongoose = require("mongoose");
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const Village = require("./Models/Village");
const User = require("./Models/User");
const Project = require("./Models/Project");
const Ticket = require("./Models/Ticket");

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const aadhaarValidator = require('aadhaar-validator');
const { error } = require("console");



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


// app.use(session({
//     secret: process.env.SESSION_SECRET || 'civictrace_fallback_secret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true }
// }));

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB Connected: CivicTrace Database Secured'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1); 
    });


const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again later."
});

app.use('/api/', globalLimiter);


// API Health Check
app.get("/", (req, res) => {
    res.json({ message: "CivicTrace API is running." });
});

// Get list of villages (JSON API)
app.get("/api/villages", async (req, res) => {
    try {
        const villages = await Village.find({});
        res.json({ success: true, villages });
    } catch (err) {
        console.error("Error fetching villages:", err);
        res.status(500).json({ success: false, message: "Error loading jurisdictions" });
    }
});

app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password, villageId, aadhaarNumber } = req.body;

        // validation
        if (!name || !email || !password || !villageId || !aadhaarNumber) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        if (!aadhaarValidator.isValidNumber(aadhaarNumber)) {
            return res.status(400).json({ success: false, message: "Invalid Aadhaar Number!" });
        }

        // Hash Aadhaar to create deterministic identifier
        const hashedAadhaar = crypto.createHash('sha256').update(aadhaarNumber).digest('hex');

        const existingUser = await User.findOne({ $or: [{ email }, { aadhaarHash: hashedAadhaar }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email or Aadhaar already registered!" });
        }

        const existingVillage = await Village.findById(villageId);
        if (!existingVillage) {
            return res.status(400).json({ success: false, message: "Invalid Village Selected!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            village: villageId,
            aadhaarHash: hashedAadhaar
        });

        await newUser.save();

        // Update village citizen count
        existingVillage.registeredCitizen += 1;
        await existingVillage.save();

        res.status(201).json({ success: true, message: "Registration successful!" });

    } catch (err) {
        console.error("Error in registration:", err);
        res.status(500).json({ success: false, message: "Registration failed. Try again!" });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required!" });
        }

        const user = await User.findOne({ email }).populate("village");
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password!" });
        }

        res.json({
            success: true,
            message: "Login successful!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                village: user.village
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Login failed. Try again!" });
    }
});

// Admin stats
app.get("/api/admin/stats", async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments();
        const openTickets = await Ticket.countDocuments({ status: "Open" });
        
        const projects = await Project.find({});
        let totalAllocated = 0;
        let totalReleased = 0;
        projects.forEach(p => {
            if (p.budget) {
                totalAllocated += p.budget.totalAllocated || 0;
                totalReleased += p.budget.releasedAmount || 0;
            }
        });

        res.json({
            success: true,
            stats: {
                totalProjects,
                openTickets,
                totalAllocated,
                totalReleased
            }
        });
    } catch (err) {
        console.error("Error fetching admin stats:", err);
        res.status(500).json({ success: false, message: "Error loading statistics" });
    }
});

// Fetch village heads (for dropdown selection)
app.get("/api/admin/users/village-heads", async (req, res) => {
    try {
        const villageHeads = await User.find({ role: "VillageHead" }).populate("village");
        res.json({ success: true, villageHeads });
    } catch (err) {
        console.error("Error fetching village heads:", err);
        res.status(500).json({ success: false, message: "Error loading village heads" });
    }
});

// Fetch all projects for admin
app.get("/api/admin/projects", async (req, res) => {
    try {
        const projects = await Project.find({})
            .populate("villageId")
            .populate("assignedVillageHead")
            .sort({ createdAt: -1 });
        res.json({ success: true, projects });
    } catch (err) {
        console.error("Error fetching projects:", err);
        res.status(500).json({ success: false, message: "Error loading projects" });
    }
});

// Create new project
app.post("/api/admin/projects", async (req, res) => {
    try {
        const { title, description, villageId, assignedVillageHead, totalAllocated, estimatedCompletionDate } = req.body;

        if (!title || !description || !villageId || !assignedVillageHead || !totalAllocated || !estimatedCompletionDate) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const newProject = new Project({
            title,
            description,
            villageId,
            assignedVillageHead,
            budget: {
                totalAllocated: Number(totalAllocated),
                releasedAmount: 0,
                pendingAmount: Number(totalAllocated)
            },
            estimatedCompletionDate: new Date(estimatedCompletionDate),
            status: "Assigned"
        });

        await newProject.save();
        res.status(201).json({ success: true, message: "Project created successfully!", project: newProject });
    } catch (err) {
        console.error("Error creating project:", err);
        res.status(500).json({ success: false, message: "Error creating project. Try again!" });
    }
});

// Release budget tranche
app.post("/api/admin/projects/:id/release-budget", async (req, res) => {
    try {
        const { amount } = req.body;
        const projectId = req.params.id;

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: "Valid release amount is required!" });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found!" });
        }

        const releaseNum = Number(amount);
        if (releaseNum > project.budget.pendingAmount) {
            return res.status(400).json({ success: false, message: "Release amount exceeds pending budget!" });
        }

        project.budget.releasedAmount += releaseNum;
        project.budget.pendingAmount -= releaseNum;

        await project.save();
        res.json({ success: true, message: "Funds released successfully!", project });
    } catch (err) {
        console.error("Error releasing budget:", err);
        res.status(500).json({ success: false, message: "Error releasing funds" });
    }
});

// Update project status
app.post("/api/admin/projects/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const projectId = req.params.id;

        const validStatuses = ['Assigned', 'In Progress', 'Head Completed', 'Admin Approved', 'Red Flagged'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value!" });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found!" });
        }

        project.status = status;
        await project.save();

        res.json({ success: true, message: `Project status updated to ${status}!`, project });
    } catch (err) {
        console.error("Error updating project status:", err);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
});

// Fetch all tickets for admin
app.get("/api/admin/tickets", async (req, res) => {
    try {
        const tickets = await Ticket.find({})
            .populate("raisedBy")
            .populate({
                path: "projectId",
                populate: { path: "villageId" }
            })
            .sort({ createdAt: -1 });
        res.json({ success: true, tickets });
    } catch (err) {
        console.error("Error fetching tickets:", err);
        res.status(500).json({ success: false, message: "Error loading tickets" });
    }
});

// Resolve ticket
app.post("/api/admin/tickets/:id/resolve", async (req, res) => {
    try {
        const { adminResponse } = req.body;
        const ticketId = req.params.id;

        if (!adminResponse || adminResponse.trim() === "") {
            return res.status(400).json({ success: false, message: "Response explanation is required!" });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found!" });
        }

        ticket.status = "Resolved";
        ticket.adminResponse = adminResponse;
        await ticket.save();

        res.json({ success: true, message: "Ticket resolved successfully!", ticket });
    } catch (err) {
        console.error("Error resolving ticket:", err);
        res.status(500).json({ success: false, message: "Error resolving ticket" });
    }
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});