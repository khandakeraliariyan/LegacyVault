const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");

const questionController = require("./question.controller");

router.post("/", authMiddleware, questionController.createQuestion);

router.get("/", authMiddleware, questionController.getMyQuestions);

router.delete("/:id", authMiddleware, questionController.deleteQuestion);

module.exports = router;