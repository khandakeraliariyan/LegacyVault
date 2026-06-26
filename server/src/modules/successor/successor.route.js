const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");

const successorController = require("./successor.controller");

router.post("/", authMiddleware, successorController.createSuccessor);

router.get("/my-successor", authMiddleware, successorController.getMySuccessor);

router.patch("/", authMiddleware, successorController.updateSuccessor);

router.delete("/", authMiddleware, successorController.deleteSuccessor);

router.get("/access", successorController.getSuccessorAccess);

router.get("/vault", successorController.getReleasedVault);

module.exports = router;