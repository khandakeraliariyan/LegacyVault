const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");

const futureMessageController = require("./futureMessage.controller");

router.post("/", authMiddleware, futureMessageController.createFutureMessage);

router.get("/", authMiddleware, futureMessageController.getMyMessages);

router.delete("/:id", authMiddleware, futureMessageController.deleteMessage);

module.exports = router;