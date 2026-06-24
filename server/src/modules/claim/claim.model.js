const mongoose = require("mongoose");

const claimSchema =
    new mongoose.Schema(
        {
            ownerId: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",

                required: true,
            },

            successorId: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Successor",

                required: true,
            },

            claimantName: {
                type: String,

                required: true,
            },

            claimantEmail: {
                type: String,

                required: true,
            },

            claimantPhone: {
                type: String,

                required: true,
            },

            identityDocumentUrl: {
                type: String,

                required: true,
            },

            score: {
                type: Number,

                default: 0,
            },

            totalQuestions: {
                type: Number,

                default: 0,
            },

            correctAnswers: {
                type: Number,

                default: 0,
            },

            reviewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },

            reviewedAt: {
                type: Date
            },

            reviewNote: {
                type: String
            },

            status: {
                type: String,

                enum: [
                    "PENDING",
                    "UNDER_REVIEW",
                    "APPROVED",
                    "REJECTED",
                ],

                default: "PENDING",
            },
        },
        {
            timestamps: true,
        }
    );

module.exports = mongoose.model(
    "Claim",
    claimSchema
);