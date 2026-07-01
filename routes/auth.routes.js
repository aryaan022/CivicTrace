const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const Village = require("../models/Village"); 
const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");
const { validateAadhaar, hashAadhaar } = require("../utils/aadhar");



router.post("/register", async (req, res) => {
    try{
        const{email,username,name,phone,password,aadhaar,villageId}=req.body;

        if(!email ||!username || !name || !phone || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        if(!validateAadhaar(aadhaar)){
            return res.status(400).json({message:"Invalid Aadhaar number"});
        }

        const adhaarHash = hashAadhaar(aadhaar);

        const existingAadhaar = await User.findOne({ adhaarHash });

        if (existingAadhaar) {
            return res.status(400).json({ message: "Aadhaar number is already registered" });
        }

        const existingUser= await User.findOne({$or: [{email},{username},{phone}]});
        if(existingUser)
        {
            return res.status(400).json({message:"User already exists"});
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        //create new user
        const user=new User({
            email,
            username,
            name,
            phone,
            password:hashedPassword,
            role:"Citizen",
            adhaarHash,
            village: villageId ,
        });
        await user.save();

        if (villageId) {
            await Village.findByIdAndUpdate(villageId, { $inc: { registeredCitizensCount: 1 } });
        }

        const token = jwt.sign({id: user._id,username:user.username,role:user.role},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.status(201).json({message:"User created successfully",token});
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
});


router.post("/login",async (req,res)=>{
    try{
        const{email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:"Email and password are required to login"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }

        const isPassword= await bcrypt.compare(password,user.password);

        if(!isPassword){
            return res.status(400).json({message:"Invalid email or password"});
        }

        const token = jwt.sign({id: user._id,username:user.username,role:user.role},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.status(200).json({message:"Login successful",token,user:{
            id:user._id,
            name:user.name,
            username:user.username,
            email:user.email,
            phone:user.phone,
            role:user.role
        }});
        
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
});



module.exports = router;
