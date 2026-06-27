const Claim = require("./claim.model");

const Question = require("../question/question.model");

const Successor = require("../successor/successor.model");

const verifyAnswers = require("./verifyAnswers");

const { createAuditLog } = require("../audit/audit.service");

const normalizeEmail = (value = "") =>
    value.trim().toLowerCase();

const normalizeText = (value = "") =>
    value.trim().toLowerCase();

const normalizeNidNumber = (value = "") =>
    value.replace(/\s+/g, "").trim();

const getVerificationQuestions = async (email) => {
    const successor = await Successor.findOne({ email });

    if (!successor) {
        throw new Error("Successor not found");
    }

    return Question.find({ ownerId: successor.ownerId }).select("_id question");
};

const createClaim = async (payload) => {
    const successor = await Successor.findOne({
        email: normalizeEmail(payload.claimantEmail),
    });

    if (!successor) {
        throw new Error("Successor not found");
    }

    const questions = await Question.find({
        ownerId: successor.ownerId,
    });

    if (questions.length === 0) {
        throw new Error("No verification questions configured for this vault");
    }

    const result = await verifyAnswers(questions, payload.answers);

    const emailMatched =
        normalizeEmail(successor.email) ===
        normalizeEmail(payload.claimantEmail);

    const relationshipMatched =
        normalizeText(successor.relationship) ===
        normalizeText(payload.claimantRelationship);

    const nidMatched =
        normalizeNidNumber(successor.nidNumber) ===
        normalizeNidNumber(payload.claimantNidNumber);

    const passedIdentityCheck =
        emailMatched &&
        relationshipMatched &&
        nidMatched;

    const autoApproved =
        passedIdentityCheck &&
        result.score >= 70;

    const claim = await Claim.create({
        ownerId: successor.ownerId,
        successorId: successor._id,
        claimantName: payload.claimantName,
        claimantEmail: payload.claimantEmail,
        claimantPhone: payload.claimantPhone,
        claimantRelationship: payload.claimantRelationship,
        claimantNidNumber: normalizeNidNumber(payload.claimantNidNumber),
        identityDocumentUrl: payload.identityDocumentUrl,
        score: result.score,
        totalQuestions: result.total,
        correctAnswers: result.correct,
        status: autoApproved ? "APPROVED" : "REJECTED",
    });

    if (autoApproved) {
        await Successor.findByIdAndUpdate(
            successor._id,
            {
                vaultAccessGranted: true,
                accessGrantedAt: new Date(),
                isVerified: true,
                status: "CLAIMED",
            }
        );
    }

    await createAuditLog({
        actorId: null,
        action: "CLAIM_SUBMITTED",
        entity: "CLAIM",
        entityId: claim._id,
        metadata: {
            score: claim.score,
            status: claim.status,
            nidMatched,
            relationshipMatched,
        },
    });

    return claim;
};

const getClaimsForOwner = async (ownerId) => {
    return Claim.find({
        ownerId,
    })
        .populate("successorId")
        .sort({
            createdAt: -1,
        });
};

module.exports = {
    createClaim,
    getVerificationQuestions,
    getClaimsForOwner,
};
