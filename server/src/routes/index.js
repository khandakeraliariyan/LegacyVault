const express = require("express");

const router = express.Router();

const authRoutes = require("../modules/auth/auth.route");

const successorRoutes = require("../modules/successor/successor.route");

const questionRoutes = require("../modules/question/question.route");

router.use("/auth", authRoutes);

router.use("/successors", successorRoutes);

router.use("/questions", questionRoutes);

module.exports = router;