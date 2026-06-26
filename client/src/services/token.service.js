import api from "./api";

export const exchangeFirebaseToken = async (
    firebaseToken
) => {

    const response =
        await api.post(
            "/auth/firebase-login",
            {
                firebaseToken,
            }
        );

    return response.data;
};