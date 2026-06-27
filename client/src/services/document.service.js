import api from "./api";

export const getDocuments = async () => {
    const response = await api.get("/documents");
    return response.data.data;
};

export const uploadDocument = async ({ file, documentName, category }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentName", documentName);
    formData.append("category", category);

    const response = await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
};

export const deleteDocument = async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
};

export const updateDocumentStatus = async ({ id, status }) => {
    const response = await api.patch(`/documents/${id}/status`, { status });
    return response.data.data;
};

export const openDocumentFile = async (id) => {
    const response = await api.get(`/documents/${id}/open`, {
        responseType: "blob",
    });

    return response.data;
};

export const downloadDocumentFile = async (id) => {
    const response = await api.get(`/documents/${id}/download`, {
        responseType: "blob",
    });

    return response.data;
};
