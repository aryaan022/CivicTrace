const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MilestoneSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Disbursed"],
        default: "Pending"
    },
    proofUrl: {
        type: String, // Contractor photo proof URL
        default: ""
    }
});

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    village: {
        type: Schema.Types.ObjectId,
        ref: "Village",
        required: true
    },
    totalBudget: {
        type: Number,
        required: true
    },
    disbursedBudget: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Proposed", "Active", "Halted", "Completed"],
        default: "Proposed"
    },
    contractorName: {
        type: String,
        required: true
    },
    milestones: [MilestoneSchema], // Array of milestone tranches
    disputesCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);
