const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/firebase-login", authController.firebaseLogin);

router.post("/login", authController.loginWithEmail);

router.post("/register", authController.registerWithEmail);

router.get("/me", authMiddleware, authController.getMe);

module.exports = router;