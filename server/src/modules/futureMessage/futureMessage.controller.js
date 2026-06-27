const futureMessageService = require("./futureMessage.service");

const createFutureMessage = async (req, res, next) => {
    try {
        const result =
            await futureMessageService.createFutureMessage(
                req.user._id,
                req.body
            );

        res.status(201).json({
            success: true,
            message:
                "Future message created",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getMyMessages = async (req, res, next) => {
    try {
        const result =
            await futureMessageService.getMyMessages(
                req.user._id
            );

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const deleteMessage = async (req, res, next) => {
    try {
        await futureMessageService.deleteMessage(
            req.user._id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message:
                "Message deleted",
        });
    } catch (error) {
        next(error);
    }
};

const updateMessage = async (req, res, next) => {
    try {
        const result =
            await futureMessageService.updateMessage(
                req.user._id,
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message:
                "Message updated",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFutureMessage,
    getMyMessages,
    deleteMessage,
    updateMessage,
};
