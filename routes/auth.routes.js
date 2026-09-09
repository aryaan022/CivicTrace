const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const Village = require("../models/Village.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateAadhaar, hashAadhaar } = require("../utils/aadhar");

router.post("/register", async (req, res) => {
    try {
        const { email, username, name, phone, password, aadhaar, villageId, role } = req.body;

        if (!email || !username || !name || !phone || !password) {
            return res.status(400).json({ message: "All basic fields (name, username, email, phone, password) are required" });
        }

        if (!aadhaar || !validateAadhaar(aadhaar)) {
            return res.status(400).json({ message: "Invalid 12-digit Aadhaar number (must pass Verhoeff checksum algorithm)" });
        }

        const adhaarHash = hashAadhaar(aadhaar);

        const existingAadhaar = await User.findOne({ adhaarHash });
        if (existingAadhaar) {
            return res.status(400).json({ message: "Aadhaar identity is already registered on this ledger" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email, username, or phone already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const assignedRole = ["Citizen", "VillageHead", "Admin"].includes(role) ? role : "Citizen";

        // Create new user
        const user = new User({
            email,
            username,
            name,
            phone,
            password: hashedPassword,
            role: assignedRole,
            adhaarHash,
            village: (assignedRole !== "Admin" && villageId) ? villageId : undefined
        });
        await user.save();

        if (villageId && assignedRole === "Citizen") {
            await Village.findByIdAndUpdate(villageId, { $inc: { registeredCitizensCount: 1 } });
        } else if (villageId && assignedRole === "VillageHead") {
            await Village.findByIdAndUpdate(villageId, { villageHead: user._id });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role, village: user.village },
            process.env.JWT_SECRET || "default_jwt_secret_civictrace",
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                village: user.village
            }
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required to login" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role, village: user.village },
            process.env.JWT_SECRET || "default_jwt_secret_civictrace",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                village: user.village
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

module.exports = router;
