const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        required:true,
        enum:["Citizen","VillageHead","Admin"],
        default:"Citizen"
    },
    adhaarHash:{
        type:String,
        required:true,
        unique:true
    }
    
})

const User = mongoose.model("User", UserSchema);
module.exports=User;
