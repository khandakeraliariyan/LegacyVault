const Successor = require("./successor.model");

const { createAuditLog, } = require("../audit/audit.service");

const createSuccessor = async (userId, payload) => {
    const existing =
        await Successor.findOne({
            ownerId: userId,
        });

    if (existing) {
        throw new Error(
            "Successor already exists"
        );
    }

    const successor =
        await Successor.create({
            ownerId: userId,
            ...payload,
        });

    await createAuditLog({
        actorId: userId,
        action: "SUCCESSOR_CREATED",
        entity: "SUCCESSOR",
        entityId: successor._id,
    });

    return successor;
};

const getMySuccessor = async (userId) => {
    return await Successor.findOne({
        ownerId: userId,
    });
};

const updateSuccessor = async (userId, payload) => {
    const successor =
        await Successor.findOneAndUpdate(
            {
                ownerId: userId,
            },
            payload,
            {
                new: true,
            }
        );

    return successor;
};

const deleteSuccessor = async (userId) => {
    return await Successor.findOneAndDelete({
        ownerId: userId,
    });
};

const getSuccessorAccess = async (successorEmail) => {
    const successor =
        await Successor.findOne({
            email: successorEmail,
        });

    if (!successor) {
        throw new Error(
            "Successor not found"
        );
    }

    return successor;
};

module.exports = {
    createSuccessor,
    getMySuccessor,
    updateSuccessor,
    deleteSuccessor,
    getSuccessorAccess
};