require('dotenv').config();
const express = require("express");
const app = express();
const  path = require("path");
const mongoose = require("mongoose");
const session = require('express-session');
const rateLimit = require('express-rate-limit');

const Village = require("./Models/Village");
const User = require("./Models/User");

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const aadhaarValidator = require('aadhaar-validator');
const { error } = require("console");



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


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


//home page
app.get("/",async(req,res)=>{
    res.render("home");
});

app.get("/register", async (req,res)=>{
    try{
        const villages = await Village.find({});
        res.render("register",{villages});
    }catch{
        console.error("Error loading registration Page Try agaain!",error);
        res.render("error");
    }
});

app.post("/api/auth/register",async(req,res)=>{
    try{
        const {name,email,password,village,aadhaar} = req.body;

        //validation
        if(!name || !email || !password || !village || !aadhaar){
            return res.status(400).render("error",{message:"All fields are required!"});
        }

        if(!aadhaarValidator.validate(aadhaar)){
            return res.status(400).render("error",{message:"Invalid AAdhaar Number!"});
        }

        const existingUser = await User.findOne({$or:[{email},{aadhaarHash:aadhaar}]});
        if(existingUser){
            return res.status(400).render("error",{message:"Email or Aadhaar already registered!"});
        }

        const existingVillage = await Village.findById(village);
        if(!existingVillage){
            return res.status(400).render("error",{message:"Invalid Village Selected!"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const hashedAadhaar = crypto.createHash('sha256').update(aadhaar).digest('hex');

        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            village,
            aadhaarHash:hashedAadhaar
        });

        await newUser.save();

        //Update village citizen count
        existingVillage.registeredCitizen += 1;
        await existingVillage.save();

        res.redirect("/login");

    }catch{

    }
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});