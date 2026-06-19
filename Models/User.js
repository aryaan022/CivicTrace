const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["citizen","admin","VillageHead"],
        default:"citizen"
    },
    village:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Village",
        required: true,
        immutable: true //can not change further once it done its done 
    },
    aadhaarHash: { 
        type: String, 
        unique: true, 
        required: true,
        immutable: true // will not be changes further
    }
    
},{timestamps:true});

module.exports = mongoose.model("User",UserSchema);