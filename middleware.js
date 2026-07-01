const jwt = require("jsonwebtoken");
const User = require("./models/User");


module.exports.isLoggedIn=(req,res,next)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; //Bearer token
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    try {
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({message:"Invalid or expired token"})
    }
    
};

module.exports.isVillageHead=async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    if(user.role!= "VillageHead"){
        return res.status(403).json({message:"Unauthorized"})
    }
    next();
};


// for admin
module.exports.isAdmin = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "Admin") {
        return res.status(403).json({ message: "Unauthorized: Requires Admin role" });
    }
    next();
};
