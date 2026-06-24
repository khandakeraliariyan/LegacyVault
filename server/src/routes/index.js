const express = require("express");

const router = express.Router();

const authRoutes = require("../modules/auth/auth.route");

const successorRoutes = require("../modules/successor/successor.route");

const questionRoutes = require("../modules/question/question.route");

const documentRoutes = require("../modules/document/document.route");

const finalWishRoutes = require("../modules/finalWish/finalWish.route");

const claimRoutes = require("../modules/claim/claim.route");

const adminRoutes = require("../modules/admin/admin.route");

router.use("/auth", authRoutes);

router.use("/successors", successorRoutes);

router.use("/questions", questionRoutes);

router.use("/documents", documentRoutes);

router.use("/final-wishes", finalWishRoutes);

router.use("/claims", claimRoutes);

router.use("/admin", adminRoutes);

module.exports = router;