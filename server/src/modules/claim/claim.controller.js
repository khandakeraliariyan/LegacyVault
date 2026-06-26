const claimService = require("./claim.service");

const createClaim =
    async (req, res, next) => {
        try {
            const claim =
                await claimService.createClaim(
                    req.body
                );

            res.status(201).json({
                success: true,

                message:
                    "Claim submitted successfully",

                data: claim,
            });
        } catch (error) {
            next(error);
        }
    };

const getVerificationQuestions =
    async (req, res, next) => {
        try {
            const { email } = req.query;

            const questions =
                await claimService.getVerificationQuestions(
                    email
                );

            res.status(200).json({
                success: true,
                data: questions,
            });
        } catch (error) {
            next(error);
        }
    };

module.exports = {
    createClaim,
    getVerificationQuestions,
};