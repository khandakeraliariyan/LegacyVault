import api from "./api";

export const exchangeFirebaseToken = async (firebaseToken) => {
    const response = await api.post("/auth/firebase-login", {
        token: firebaseToken,
    });

    return response.data;
};

export const fetchCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return response.data.data;
};
