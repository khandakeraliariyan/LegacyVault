const mongoose = require("mongoose");

const finalWishSchema =
    new mongoose.Schema(
        {
            ownerId: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",

                required: true,
            },

            category: {
                type: String,

                enum: [
                    "PERSONAL",
                    "FAMILY",
                    "ASSET",
                    "BUSINESS",
                    "OTHER",
                ],

                required: true,
            },

            title: {
                type: String,

                required: true,

                trim: true,
            },

            content: {
                type: String,

                required: true,
            },
        },
        {
            timestamps: true,
        }
    );

module.exports = mongoose.model(
    "FinalWish",
    finalWishSchema
);