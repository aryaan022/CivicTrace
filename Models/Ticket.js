const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    citizen: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Open", "Under Review", "Resolved"],
        default: "Open"
    },
    upvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User" // Tracks user IDs who upvoted to prevent double voting
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);
