const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");

const finalWishController = require("./finalWish.controller");

router.post("/", authMiddleware, finalWishController.createFinalWish);

router.get("/", authMiddleware, finalWishController.getMyFinalWishes);

router.patch("/:id", authMiddleware, finalWishController.updateFinalWish);

router.delete("/:id", authMiddleware, finalWishController.deleteFinalWish);

module.exports = router;