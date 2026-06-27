const mongoose = require("mongoose");

const successorSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },

        phone: {
            type: String,
            required: true,
        },

        relationship: {
            type: String,
            required: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        vaultAccessGranted: {
            type: Boolean,
            default: false
        },

        accessGrantedAt: {
            type: Date
        },
        
        status: {
            type: String,
            enum: [
                "PENDING",
                "ACTIVE",
                "CLAIMED",
            ],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Successor",
    successorSchema
);
