const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/firebase-login", authController.firebaseLogin);

router.get("/me", authMiddleware, authController.getMe);

module.exports = router;