const mongoose = require("mongoose");


const VillageSchema = new mongoose.Schema({
    name:{    
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    registeredCitizen:{
        type:Number,
        default:0
    },

    location:{
        latitude:{
            type:Number
        },
        longitude:{
            type:Number
        }
    }
    
},{timestamps:true});

module.exports = mongoose.model("Village",VillageSchema);