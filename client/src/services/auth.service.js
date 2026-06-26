import api from "./api";
import {
    firebaseGoogleLogin,
    firebaseLogout,
} from "./firebase.service";
import { saveToken } from "../utils/storage";

export const loginUser = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password,
    });

    const data = response.data.data;
    saveToken(data.idToken);

    return data;
};

export const registerUser = async (name, email, password) => {
    const response = await api.post("/auth/register", {
        name,
        email,
        password,
    });

    const data = response.data.data;
    saveToken(data.idToken);

    return data;
};

export const googleLogin = () => {
    return firebaseGoogleLogin();
};

export const logoutUser = async () => {
    try {
        await firebaseLogout();
    } catch {
        // Ignore if Firebase client session was never created.
    }
};

export const backendLogin = async (firebaseToken) => {
    const res = await api.post("/auth/firebase-login", {
        token: firebaseToken,
    });

    return res.data;
};
