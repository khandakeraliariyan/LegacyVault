import api from "./api";

export const getFutureMessages = async () => {
    const response = await api.get("/future-messages");
    return response.data.data;
};

export const createFutureMessage = async (payload) => {
    const response = await api.post("/future-messages", payload);
    return response.data.data;
};

export const deleteFutureMessage = async (id) => {
    const response = await api.delete(`/future-messages/${id}`);
    return response.data;
};
