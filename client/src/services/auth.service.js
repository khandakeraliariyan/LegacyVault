import api from "./api";

export const backendLogin = async (
    firebaseToken
) => {

    const res =
        await api.post(
            "/auth/firebase-login",
            {
                firebaseToken,
            }
        );

    return res.data;

};