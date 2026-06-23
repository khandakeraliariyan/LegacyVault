const User = require("../user/user.model");

const Claim = require("../claim/claim.model");

const getDashboardStats = async () => {
    const totalUsers =
        await User.countDocuments();

    const totalClaims =
        await Claim.countDocuments();

    const pendingClaims =
        await Claim.countDocuments({
            status: "UNDER_REVIEW",
        });

    const approvedClaims =
        await Claim.countDocuments({
            status: "APPROVED",
        });

    return {
        totalUsers,
        totalClaims,
        pendingClaims,
        approvedClaims,
    };
};

const getPendingClaims = async () => {
    return await Claim.find({
        status: "UNDER_REVIEW",
    })
        .populate("ownerId")
        .populate("successorId");
};

module.exports = {
    getDashboardStats,
    getPendingClaims
};