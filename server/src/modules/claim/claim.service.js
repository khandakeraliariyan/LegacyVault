const Claim = require("./claim.model");

const Question = require("../question/question.model");

const Successor = require("../successor/successor.model");

const verifyAnswers = require("./verifyAnswers");

const createClaim =
    async payload => {
        const successor =
            await Successor.findOne({
                email:
                    payload.claimantEmail,
            });

        if (!successor) {
            throw new Error(
                "Successor not found"
            );
        }

        const questions =
            await Question.find({
                ownerId:
                    successor.ownerId,
            });

        const result =
            await verifyAnswers(
                questions,
                payload.answers
            );

        const claim =
            await Claim.create({
                ownerId:
                    successor.ownerId,

                successorId:
                    successor._id,

                claimantName:
                    payload.claimantName,

                claimantEmail:
                    payload.claimantEmail,

                claimantPhone:
                    payload.claimantPhone,

                identityDocumentUrl:
                    payload.identityDocumentUrl,

                score: result.score,

                totalQuestions:
                    result.total,

                correctAnswers:
                    result.correct,

                status:
                    result.score >= 70
                        ? "UNDER_REVIEW"
                        : "REJECTED",
            });

        return claim;
    };

module.exports = {
    createClaim,
};