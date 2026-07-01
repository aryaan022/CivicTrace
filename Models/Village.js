const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VillageSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    villageHead: {
        type: Schema.Types.ObjectId,
        ref: "User", // Links to the User model (for the VillageHead role)
        default: null
    },
    budgetAllocated: {
        type: Number,
        default: 0
    },
    budgetSpent: {
        type: Number,
        default: 0
    },
    registeredCitizensCount: {
        type: Number,
        default: 0 
    },
}, { timestamps: true });

module.exports = mongoose.model("Village", VillageSchema);
