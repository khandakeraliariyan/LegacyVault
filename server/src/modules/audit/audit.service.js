const AuditLog = require(
    "./audit.model"
);

const createAuditLog =
    async ({
        actorId,
        action,
        entity,
        entityId,
        metadata = {},
    }) => {
        return await AuditLog.create({
            actorId,
            action,
            entity,
            entityId,
            metadata,
        });
    };

module.exports = {
    createAuditLog,
};