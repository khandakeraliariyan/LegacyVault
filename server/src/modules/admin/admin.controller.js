const adminService = require("./admin.service");

const getDashboard = async (req, res, next) => {
    try {
        const data =
            await adminService.getDashboardStats();

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

const getPendingClaims = async (req, res, next) => {
    try {
        const claims =
            await adminService.getPendingClaims();

        res.status(200).json({
            success: true,
            data: claims,
        });
    } catch (error) {
        next(error);
    }
};

const approveClaim = async (req, res, next) => {
    try {
        const claim =
            await adminService.approveClaim(
                req.params.id,
                req.user._id
            );

        res.status(200).json({
            success: true,

            message:
                "Claim approved successfully",

            data: claim
        });

    } catch (error) {
        next(error);
    }
};

const rejectClaim = async (req, res, next) => {
    try {
        const claim =
            await adminService.rejectClaim(
                req.params.id,
                req.user._id,
                req.body.reason
            );

        res.status(200).json({
            success: true,

            message:
                "Claim rejected",

            data: claim
        });

    } catch (error) {
        next(error);
    }
};

const getAuditLogs = async (req, res, next) => {
    try {
        const logs =
            await adminService.getAuditLogs();

        res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard,
    getPendingClaims,
    approveClaim,
    rejectClaim,
    getAuditLogs,
};