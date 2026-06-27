const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");

const upload = require("../../config/multer");

const documentController = require("./document.controller");

router.post("/", authMiddleware, upload.single("file"), documentController.uploadDocument);

router.get("/", authMiddleware, documentController.getMyDocuments);

router.get("/:id/open", authMiddleware, documentController.openDocumentFile);

router.get("/:id/download", authMiddleware, documentController.downloadDocumentFile);

router.patch("/:id/status", authMiddleware, documentController.updateDocumentStatus);

router.delete("/:id", authMiddleware, documentController.deleteDocument);

module.exports = router;
