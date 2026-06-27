const cloudinary = require("../../config/cloudinary");

const Document = require("./document.model");

const streamifier = require("streamifier");
const path = require("path");

const { createAuditLog, } = require("../audit/audit.service");

const getInitialDocumentStatus = (category) =>
    category === "DIGITAL_ASSETS"
        ? "ACTION_REQUIRED"
        : "VERIFIED";

const SIGNED_EXTENSION_TYPES = new Set([
    "pdf",
    "zip",
]);

const uploadDocument = async (userId, file, payload) => {
    const uploadResult = await new Promise((resolve, reject) => {
        const stream =
            cloudinary.uploader.upload_stream(
                {
                    folder:
                        "legacyvault/documents",
                    resource_type:
                        "auto",
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

            fileSize:
                uploadResult.bytes || 0,

            fileExtension:
                (
                    uploadResult.format ||
                    path.extname(file.originalname || "").replace(".", "")
                ).toUpperCase(),

            resourceType:
                uploadResult.resource_type || "image",

            status:
                getInitialDocumentStatus(payload.category),

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
    }).sort({
        createdAt: -1,
    });
};

const getDocumentById = async (userId, documentId) => {
    const document = await Document.findOne({
        _id: documentId,
        ownerId: userId,
    });

    if (!document) {
        throw new Error("Document not found");
    }

    return document;
};

const updateDocumentStatus = async (userId, documentId, status) => {
    const document = await Document.findOneAndUpdate(
        {
            _id: documentId,
            ownerId: userId,
        },
        {
            status,
        },
        {
            new: true,
        }
    );

    if (!document) {
        throw new Error("Document not found");
    }

    await createAuditLog({
        actorId: userId,
        action: "DOCUMENT_STATUS_UPDATED",
        entity: "DOCUMENT",
        entityId: document._id,
        metadata: {
            status,
        },
    });

    return document;
};

const buildFileDeliveryUrl = (document, mode = "inline") => {
    const extension =
        (document.fileExtension || "")
            .toLowerCase();

    const requiresSignedAccess =
        SIGNED_EXTENSION_TYPES.has(
            extension
        );

    if (!requiresSignedAccess) {
        if (mode === "inline") {
            return document.fileUrl;
        }

        const safeFileName =
            document.documentName
                .replace(/[^\w.\- ]+/g, "")
                .trim() || "document";

        return cloudinary.url(
            document.publicId,
            {
                secure: true,
                resource_type:
                    document.resourceType || "auto",
                type: "upload",
                flags:
                    `attachment:${safeFileName}`,
                ...(extension
                    ? { format: extension }
                    : {}),
            }
        );
    }

    return cloudinary.utils.private_download_url(
        document.publicId,
        extension,
        {
            resource_type:
                document.resourceType || "image",
            type: "upload",
            attachment:
                mode === "attachment",
            expires_at:
                Math.floor(Date.now() / 1000) + 60 * 10,
        }
    );
};

const streamDocumentFile = async (userId, documentId, mode = "inline") => {
    const document = await getDocumentById(userId, documentId);

    return {
        document,
        deliveryUrl:
            buildFileDeliveryUrl(
                document,
                mode
            ),
    };
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
        document.publicId,
        {
            resource_type:
                document.resourceType || "image",
        }
    );

    await document.deleteOne();
};

module.exports = {
    uploadDocument,
    getMyDocuments,
    getDocumentById,
    deleteDocument,
    updateDocumentStatus,
    streamDocumentFile,
};
