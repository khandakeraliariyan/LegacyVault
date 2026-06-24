const cloudinary = require("../../config/cloudinary");

const Document = require("./document.model");

const streamifier = require("streamifier");

const { createAuditLog, } = require("../audit/audit.service");

const uploadDocument = async (userId, file, payload) => {
    const uploadResult = await new Promise((resolve, reject) => {
        const stream =
            cloudinary.uploader.upload_stream(
                {
                    folder:
                        "legacyvault/documents",
                },
                (error, result) => {
                    if (error)
                        reject(error);

                    resolve(result);
                }
            );

        streamifier
            .createReadStream(file.buffer)
            .pipe(stream);
    }
    );

    const document =
        await Document.create({
            ownerId: userId,

            documentName:
                payload.documentName,

            category: payload.category,

            fileUrl:
                uploadResult.secure_url,

            publicId:
                uploadResult.public_id,
        });

    await createAuditLog({
        actorId: userId,
        action: "DOCUMENT_UPLOADED",
        entity: "DOCUMENT",
        entityId: document._id,
    });

    return document;
};

const getMyDocuments = async (userId) => {
    return await Document.find({
        ownerId: userId,
    });
};

const deleteDocument = async (userId, documentId) => {
    const document =
        await Document.findOne({
            _id: documentId,

            ownerId: userId,
        });

    if (!document) {
        throw new Error(
            "Document not found"
        );
    }

    await cloudinary.uploader.destroy(
        document.publicId
    );

    await document.deleteOne();
};

module.exports = {
    uploadDocument,
    getMyDocuments,
    deleteDocument,
};