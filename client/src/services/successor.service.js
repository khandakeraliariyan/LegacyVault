import api from "./api";

export const getMySuccessor = async () => {
    const response = await api.get("/successors/my-successor");
    return response.data.data;
};

export const createSuccessor = async (payload) => {
    const response = await api.post("/successors", payload);
    return response.data.data;
};

export const updateSuccessor = async (payload) => {
    const response = await api.patch("/successors", payload);
    return response.data.data;
};

export const deleteSuccessor = async () => {
    const response = await api.delete("/successors");
    return response.data;
};

export const getSuccessorAccess = async (email) => {
    const response = await api.get("/successors/access", {
        params: { email },
    });
    return response.data.data;
};

export const getReleasedVault = async (email) => {
    const response = await api.get("/successors/vault", {
        params: { email },
    });
    return response.data.data;
};
