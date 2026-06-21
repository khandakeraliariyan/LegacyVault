const Successor = require("./successor.model");

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

module.exports = {
    createSuccessor,
    getMySuccessor,
    updateSuccessor,
    deleteSuccessor,
};