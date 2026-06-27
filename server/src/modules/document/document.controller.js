const documentService = require("./document.service");

const uploadDocument = async (req, res, next) => {
        try {
            const document =
                await documentService.uploadDocument(
                    req.user._id,
                    req.file,
                    req.body
                );

            res.status(201).json({
                success: true,

                message:
                    "Document uploaded successfully",

                data: document,
            });
        } catch (error) {
            next(error);
        }
    };

const getMyDocuments =  async (req, res, next) => {
        try {
            const documents =
                await documentService.getMyDocuments(
                    req.user._id
                );

            res.status(200).json({
                success: true,

                data: documents,
            });
        } catch (error) {
            next(error);
        }
    };

const openDocumentFile = async (req, res, next) => {
        try {
            const file =
                await documentService.streamDocumentFile(
                    req.user._id,
                    req.params.id,
                    "inline"
                );

            res.redirect(file.deliveryUrl);
        } catch (error) {
            next(error);
        }
    };

const downloadDocumentFile = async (req, res, next) => {
        try {
            const file =
                await documentService.streamDocumentFile(
                    req.user._id,
                    req.params.id,
                    "attachment"
                );

            res.redirect(file.deliveryUrl);
        } catch (error) {
            next(error);
        }
    };

const updateDocumentStatus = async (req, res, next) => {
        try {
            const document =
                await documentService.updateDocumentStatus(
                    req.user._id,
                    req.params.id,
                    req.body.status
                );

            res.status(200).json({
                success: true,
                message:
                    "Document status updated successfully",
                data: document,
            });
        } catch (error) {
            next(error);
        }
    };

const deleteDocument =  async (req, res, next) => {
        try {
            await documentService.deleteDocument(
                req.user._id,
                req.params.id
            );

            res.status(200).json({
                success: true,

                message:
                    "Document deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    };

module.exports = {
    uploadDocument,

    getMyDocuments,

    openDocumentFile,

    downloadDocumentFile,

    updateDocumentStatus,

    deleteDocument,
};
