const express = require("express");

const router = express.Router();

const claimController = require("./claim.controller");

router.post("/submit", claimController.createClaim);

module.exports = router;