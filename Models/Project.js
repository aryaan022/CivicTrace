const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    
    // Relationships
    villageId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Village', 
        required: true 
    },
    assignedVillageHead: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    // Milestone Logic
    budget: {
        totalAllocated: {
            type: Number,
            required: true 
        },
        releasedAmount: { 
            type: Number, 
            default: 0 
        },
        pendingAmount: { 
            type: Number, 
            required: true 
        }
    },
    
    estimatedCompletionDate: { 
        type: Date, 
        required: true 
    },
    
    status: { 
        type: String, 
        enum: ['Assigned', 'In Progress', 'Head Completed', 'Admin Approved', 'Red Flagged'], 
        default: 'Assigned' 
    },
    
    //Community Consensus Arrays (Storing User IDs to prevent double-voting)
    approvalVotes: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    disputeVotes: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    
    //Cloudinary Image URLs uploaded by the Village Head as proof
    proofOfWorkImages: [
        { type: String }
    ]
    
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);