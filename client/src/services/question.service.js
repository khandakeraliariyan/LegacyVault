import api from "./api";

export const getQuestions = async () => {
    const response = await api.get("/questions");
    return response.data.data;
};

export const createQuestion = async (payload) => {
    const response = await api.post("/questions", payload);
    return response.data.data;
};

export const deleteQuestion = async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
};
