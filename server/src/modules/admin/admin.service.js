const User = require("../user/user.model");

const Claim = require("../claim/claim.model");

const Successor = require("../successor/successor.model");

const { createAuditLog, } = require("../audit/audit.service");

const AuditLog = require("../audit/audit.model");

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

const approveClaim = async (claimId, adminId) => {
    const claim =
        await Claim.findById(claimId);

    if (!claim) {
        throw new Error(
            "Claim not found"
        );
    }

    if (
        claim.status !==
        "UNDER_REVIEW"
    ) {
        throw new Error(
            "Claim already processed"
        );
    }

    claim.status = "APPROVED";

    claim.reviewedBy =
        adminId;

    claim.reviewedAt =
        new Date();

    await claim.save();

    await createAuditLog({
        actorId: adminId,
        action: "CLAIM_APPROVED",
        entity: "CLAIM",
        entityId: claim._id,
        metadata: {
            successorId:
                claim.successorId,
        },
    });

    await Successor.findByIdAndUpdate(
        claim.successorId,
        {
            vaultAccessGranted: true,

            accessGrantedAt:
                new Date(),

            isVerified: true,
        }
    );

    return claim;
};

const rejectClaim = async (claimId, adminId, reason) => {
    const claim = await Claim.findById(claimId);

    if (!claim) {
        throw new Error(
            "Claim not found"
        );
    }

    claim.status = "REJECTED";

    claim.reviewedBy = adminId;

    claim.reviewedAt = new Date();

    claim.reviewNote = reason;

    await claim.save();

    await createAuditLog({
        actorId: adminId,
        action: "CLAIM_REJECTED",
        entity: "CLAIM",
        entityId: claim._id,
        metadata: {
            reason,
        },
    });

    return claim;
};

const getAuditLogs =
    async () => {
        return await AuditLog.find()
            .sort({ createdAt: -1 })
            .limit(100);
    };

module.exports = {
    getDashboardStats,
    getPendingClaims,
    approveClaim,
    rejectClaim,
    getAuditLogs
};