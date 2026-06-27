const Successor = require("./successor.model");

const User = require("../user/user.model");

const Document = require("../document/document.model");

const FinalWish = require("../finalWish/finalWish.model");

const FutureMessage = require("../futureMessage/futureMessage.model");

const { createAuditLog } = require("../audit/audit.service");

const normalizeEmail = (email = "") =>
    email.trim().toLowerCase();

const ensureSuccessorEmailAvailable = async (userId, email) => {
    const existingSuccessor = await Successor.findOne({
        email: normalizeEmail(email),
    });

    if (
        existingSuccessor &&
        existingSuccessor.ownerId.toString() !== userId.toString()
    ) {
        throw new Error(
            "This successor email is already assigned to another vault owner."
        );
    }
};

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

    await ensureSuccessorEmailAvailable(
        userId,
        payload.email
    );

    const successor =
        await Successor.create({
            ownerId: userId,
            ...payload,
            email: normalizeEmail(payload.email),
        });

    await createAuditLog({
        actorId: userId,
        action: "SUCCESSOR_CREATED",
        entity: "SUCCESSOR",
        entityId: successor._id,
    });

    return successor;
};

const getMySuccessor = async (userId) => {
    return await Successor.findOne({
        ownerId: userId,
    });
};

const updateSuccessor = async (userId, payload) => {
    if (payload.email) {
        await ensureSuccessorEmailAvailable(
            userId,
            payload.email
        );
    }

    const successor =
        await Successor.findOneAndUpdate(
            {
                ownerId: userId,
            },
            {
                ...payload,
                ...(payload.email
                    ? {
                        email: normalizeEmail(payload.email),
                    }
                    : {}),
            },
            {
                new: true,
            }
        );

    if (!successor) {
        throw new Error("Successor not found");
    }

    return successor;
};

const deleteSuccessor = async (userId) => {
    return await Successor.findOneAndDelete({
        ownerId: userId,
    });
};

const getSuccessorAccess = async (successorEmail) => {
    const successor =
        await Successor.findOne({
            email: successorEmail,
        });

    if (!successor) {
        throw new Error(
            "Successor not found"
        );
    }

    return successor;
};

const getReleasedVault = async (successorEmail) => {
    const successor = await Successor.findOne({
        email: successorEmail,
    });

    if (!successor) {
        throw new Error("Successor not found");
    }

    if (!successor.vaultAccessGranted) {
        throw new Error("Vault access not granted");
    }

    const [owner, documents, finalWishes, futureMessages] = await Promise.all([
        User.findById(successor.ownerId).select("name email"),
        Document.find({ ownerId: successor.ownerId }),
        FinalWish.find({ ownerId: successor.ownerId }),
        FutureMessage.find({ ownerId: successor.ownerId }),
    ]);

    return {
        owner,
        successor,
        documents,
        finalWishes,
        futureMessages,
    };
};

module.exports = {
    createSuccessor,
    getMySuccessor,
    updateSuccessor,
    deleteSuccessor,
    getSuccessorAccess,
    getReleasedVault,
};
