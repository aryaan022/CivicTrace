const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
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
})


module.exports=router;