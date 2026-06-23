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

module.exports = {
    createClaim,
};