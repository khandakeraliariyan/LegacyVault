import api from "./api";
import {
    firebaseGoogleLogin,
    firebaseLogin,
    firebaseLogout,
    firebaseRegister,
} from "./firebase.service";

export const loginUser = (
    email,
    password
) => {
    return firebaseLogin(
        email,
        password
    );
};

export const registerUser = async (
    name,
    email,
    password
) => {
    const user =
        await firebaseRegister(
            name,
            email,
            password
        );

    return {
        user,
    };
};

export const googleLogin = () => {
    return firebaseGoogleLogin();
};

export const logoutUser = () => {
    return firebaseLogout();
};

export const backendLogin = async (firebaseToken) => {
    const res = await api.post("/auth/firebase-login", {
        token: firebaseToken,
    });

    return res.data;
};
