const jwt = require("jsonwebtoken");
const User = require("./models/User");

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_civictrace";

module.exports.isLoggedIn = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Access token is missing" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports.isVillageHead = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "VillageHead") {
            return res.status(403).json({ message: "Unauthorized: Requires Village Head role" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Authorization check error" });
    }
};

module.exports.isAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "Admin") {
            return res.status(403).json({ message: "Unauthorized: Requires Admin role" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Authorization check error" });
    }
};
