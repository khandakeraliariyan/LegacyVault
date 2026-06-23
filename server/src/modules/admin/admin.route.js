const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");

const roleMiddleware = require("../../middlewares/role.middleware");

const adminController = require("./admin.controller");

router.get("/dashboard", authMiddleware, roleMiddleware("ADMIN"), adminController.getDashboard);

module.exports = router;