import api from "./api";

export const getVerificationQuestions = async (email) => {
    const response = await api.get("/claims/verification-questions", {
        params: { email },
    });
    return response.data.data;
};

export const submitClaim = async (payload) => {
    const response = await api.post("/claims/submit", payload);
    return response.data.data;
};
