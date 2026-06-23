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

module.exports = {
    getDashboard,
    getPendingClaims
};