const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    
    category: { 
        type: String, 
        enum: ['Fund Extension', 'Time Extension', 'Site Problem', 'General Dispute', 'Milestone Completed'],
        required: true
    },
    
    description: { type: String, required: true },
    
    status: { 
        type: String, 
        enum: ['Open', 'In Review', 'Resolved'], 
        default: 'Open' 
    },
    
    // Admin's written decision upon closing the ticket
    adminResponse: { type: String }
    
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);