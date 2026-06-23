const finalWishService = require("./finalWish.service");

const createFinalWish = async (req, res, next) => {
    try {
        const wish =
            await finalWishService.createFinalWish(
                req.user._id,
                req.body
            );

        res.status(201).json({
            success: true,

            message:
                "Final wish created successfully",

            data: wish,
        });
    } catch (error) {
        next(error);
    }
};

const getMyFinalWishes = async (req, res, next) => {
    try {
        const wishes =
            await finalWishService.getMyFinalWishes(
                req.user._id
            );

        res.status(200).json({
            success: true,

            data: wishes,
        });
    } catch (error) {
        next(error);
    }
};

const updateFinalWish = async (req, res, next) => {
    try {
        const wish =
            await finalWishService.updateFinalWish(
                req.user._id,
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,

            data: wish,
        });
    } catch (error) {
        next(error);
    }
};

const deleteFinalWish = async (req, res, next) => {
    try {
        await finalWishService.deleteFinalWish(
            req.user._id,
            req.params.id
        );

        res.status(200).json({
            success: true,

            message:
                "Final wish deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFinalWish,

    getMyFinalWishes,

    updateFinalWish,

    deleteFinalWish,
};