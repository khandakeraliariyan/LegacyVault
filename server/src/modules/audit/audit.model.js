const mongoose = require("mongoose");

const auditSchema =
    new mongoose.Schema(
        {
            actorId: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",
            },

            action: {
                type: String,
                required: true,
            },

            entity: {
                type: String,
                required: true,
            },

            entityId: {
                type: String,
            },

            metadata: {
                type: Object,
                default: {},
            },
        },
        {
            timestamps: true,
        }
    );

module.exports = mongoose.model(
    "AuditLog",
    auditSchema
);