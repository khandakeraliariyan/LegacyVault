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
