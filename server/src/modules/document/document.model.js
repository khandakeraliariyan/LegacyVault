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