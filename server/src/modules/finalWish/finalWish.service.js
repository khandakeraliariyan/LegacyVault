const FinalWish = require("./finalWish.model"
);

const createFinalWish = async (userId, payload) => {
    return await FinalWish.create({
        ownerId: userId,

        ...payload,
    });
};

const getMyFinalWishes = async (userId) => {
    return await FinalWish.find({
        ownerId: userId,
    });
};

const updateFinalWish = async (userId, wishId, payload) => {
    return await FinalWish.findOneAndUpdate(
        {
            _id: wishId,

            ownerId: userId,
        },

        payload,

        {
            new: true,
        }
    );
};

const deleteFinalWish = async (userId, wishId) => {
    return await FinalWish.findOneAndDelete({
        _id: wishId,

        ownerId: userId,
    });
};

module.exports = {
    createFinalWish,

    getMyFinalWishes,

    updateFinalWish,

    deleteFinalWish,
};