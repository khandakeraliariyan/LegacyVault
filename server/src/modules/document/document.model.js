const mongoose = require("mongoose");

const documentSchema =
    new mongoose.Schema(
        {
            ownerId: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",

                required: true,
            },

            documentName: {
                type: String,
                required: true,
            },

            category: {
                type: String,

                enum: [
                    "IDENTITY",
                    "FINANCIAL",
                    "PROPERTY",
                    "INSURANCE",
                    "BUSINESS",
                    "DIGITAL_ASSETS",
                ],

                required: true,
            },

            fileSize: {
                type: Number,
                default: 0,
            },

            fileExtension: {
                type: String,
                default: "",
            },

            resourceType: {
                type: String,
                default: "image",
            },

            status: {
                type: String,
                enum: [
                    "VERIFIED",
                    "ARCHIVED",
                    "ACTION_REQUIRED",
                ],
                default: "VERIFIED",
            },

            fileUrl: {
                type: String,
                required: true,
            },

            publicId: {
                type: String,
                required: true,
            },
        },
        {
            timestamps: true,
        }
    );

module.exports = mongoose.model(
    "Document",
    documentSchema
);
