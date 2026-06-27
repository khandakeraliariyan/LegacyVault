const FutureMessage = require("./futureMessage.model");

const { createAuditLog, } = require("../audit/audit.service");

const createFutureMessage = async (userId, payload) => {
    const message =
        await FutureMessage.create({
            ownerId: userId,
            ...payload,
        });

    await createAuditLog({
        actorId: userId,
        action:
            "FUTURE_MESSAGE_CREATED",
        entity:
            "FUTURE_MESSAGE",
        entityId:
            message._id,
    });

    return message;
};

const getMyMessages = async (userId) => {
    return await FutureMessage.find({
        ownerId: userId,
    });
};

const deleteMessage = async (userId, messageId) => {
    return await FutureMessage.findOneAndDelete(
        {
            _id: messageId,
            ownerId: userId,
        }
    );
};

const updateMessage = async (userId, messageId, payload) => {
    return await FutureMessage.findOneAndUpdate(
        {
            _id: messageId,
            ownerId: userId,
        },
        payload,
        {
            new: true,
        }
    );
};

module.exports = {
    createFutureMessage,
    getMyMessages,
    deleteMessage,
    updateMessage,
};
