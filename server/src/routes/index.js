const express = require("express");

const router = express.Router();

const authRoutes = require("../modules/auth/auth.route");

const successorRoutes = require("../modules/successor/successor.route");

router.use("/auth", authRoutes);

router.use("/successors", successorRoutes);

module.exports = router;