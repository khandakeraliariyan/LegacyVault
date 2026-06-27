const express = require("express");

const router = express.Router();

const claimController = require("./claim.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.get("/verification-questions", claimController.getVerificationQuestions);

router.get("/mine", authMiddleware, claimController.getMyClaims);

router.post("/submit", claimController.createClaim);

module.exports = router;
