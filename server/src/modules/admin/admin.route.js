const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");

const roleMiddleware = require("../../middlewares/role.middleware");

const adminController = require("./admin.controller");

router.get("/dashboard", authMiddleware, roleMiddleware("ADMIN"), adminController.getDashboard);

router.get("/claims", authMiddleware, roleMiddleware("ADMIN"), adminController.getPendingClaims);

router.patch("/claims/:id/approve", authMiddleware, roleMiddleware("ADMIN"), adminController.approveClaim);

router.patch("/claims/:id/reject", authMiddleware, roleMiddleware("ADMIN"), adminController.rejectClaim);

module.exports = router;