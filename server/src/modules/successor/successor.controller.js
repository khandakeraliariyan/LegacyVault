const successorService = require("./successor.service");

const createSuccessor = async (req, res, next) => {
    try {
        const successor =
            await successorService.createSuccessor(
                req.user._id,
                req.body
            );

        res.status(201).json({
            success: true,
            message:
                "Successor added successfully",
            data: successor,
        });
    } catch (error) {
        next(error);
    }
};

const getMySuccessor = async (req, res, next) => {
    try {
        const successor =
            await successorService.getMySuccessor(
                req.user._id
            );

        res.status(200).json({
            success: true,
            data: successor,
        });
    } catch (error) {
        next(error);
    }
};

const updateSuccessor = async (req, res, next) => {
    try {
        const successor =
            await successorService.updateSuccessor(
                req.user._id,
                req.body
            );

        res.status(200).json({
            success: true,
            data: successor,
        });
    } catch (error) {
        next(error);
    }
};

const deleteSuccessor = async (req, res, next) => {
    try {
        await successorService.deleteSuccessor(
            req.user._id
        );

        res.status(200).json({
            success: true,
            message:
                "Successor deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

const getSuccessorAccess = async (req, res, next) => {
    try {
        const { email } = req.query;

        const result =
            await successorService.getSuccessorAccess(
                email
            );

        res.status(200).json({
            success: true,
            data: {
                vaultAccessGranted:
                    result.vaultAccessGranted,

                accessGrantedAt:
                    result.accessGrantedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSuccessor,
    getMySuccessor,
    updateSuccessor,
    deleteSuccessor,
    getSuccessorAccess
};