const express = require("express");

const router = express.Router();

const authRoutes = require("../modules/auth/auth.route");

router.use("/auth", authRoutes);

module.exports = router;