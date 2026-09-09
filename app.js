require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { isLoggedIn } = require("./middleware");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const villageRoutes = require("./routes/village.routes");
const adminRoutes = require("./routes/admin.routes");
const Village = require("./models/Village");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Automatic seeding helper for initial Panchayats
async function seedDefaultVillages() {
    try {
        const count = await Village.countDocuments();
        if (count === 0) {
            console.log("Seeding default Panchayat jurisdictions...");
            await Village.insertMany([
                { name: "Rampur Panchayat", district: "Patna", state: "Bihar", registeredCitizensCount: 14, budgetAllocated: 1250000, budgetSpent: 450000 },
                { name: "Sonpur Society", district: "Saran", state: "Bihar", registeredCitizensCount: 18, budgetAllocated: 890000, budgetSpent: 300000 },
                { name: "Pipili Village", district: "Puri", state: "Odisha", registeredCitizensCount: 10, budgetAllocated: 1500000, budgetSpent: 600000 }
            ]);
            console.log("Default Panchayats seeded successfully.");
        }
    } catch (err) {
        console.error("Village seeding warning:", err.message);
    }
}

mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/civictrace")
    .then(() => {
        console.log("MongoDB connected successfully");
        seedDefaultVillages();
    })
    .catch((err) => console.error("Database connection error:", err));

// Public route to list all active Panchayats for registration dropdown
app.get("/api/villages", async (req, res) => {
    try {
        const villages = await Village.find().select("name district state registeredCitizensCount");
        res.status(200).json({ villages });
    } catch (err) {
        console.error("Fetch public villages error:", err);
        res.status(500).json({ message: "Unable to retrieve village list" });
    }
});

// Mounted Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/village", villageRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the CivicTrace Consensus Auditing API" });
});

app.get("/api/protected", isLoggedIn, (req, res) => {
    res.json({ message: "You are protected", user: req.user });
});

app.listen(PORT, () => {
    console.log(`CivicTrace Server is running on port ${PORT}`);
});
