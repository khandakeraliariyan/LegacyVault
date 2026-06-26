import api from "./api";

export const getFinalWishes = async () => {
    const response = await api.get("/final-wishes");
    return response.data.data;
};

export const createFinalWish = async (payload) => {
    const response = await api.post("/final-wishes", payload);
    return response.data.data;
};

export const updateFinalWish = async (id, payload) => {
    const response = await api.patch(`/final-wishes/${id}`, payload);
    return response.data.data;
};

export const deleteFinalWish = async (id) => {
    const response = await api.delete(`/final-wishes/${id}`);
    return response.data;
};
