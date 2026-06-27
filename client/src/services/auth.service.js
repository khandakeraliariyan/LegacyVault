import api from "./api";
import {
    firebaseLogin,
    firebaseRegister,
    firebaseGoogleLogin,
    firebaseLogout,
    firebaseConfirmPasswordReset,
    firebaseRequestPasswordReset,
    firebaseVerifyPasswordResetCode,
} from "./firebase.service";
import { saveToken } from "../utils/storage";

export const loginUser = async (email, password) => {
    const credential = await firebaseLogin(
        email,
        password
    );

    const idToken =
        await credential.user.getIdToken();

    saveToken(idToken);

    const data =
        await backendLogin(idToken);

    return {
        ...data.data,
        idToken,
    };
};

export const registerUser = async (name, email, password) => {
    const firebaseUser =
        await firebaseRegister(
            name,
            email,
            password
        );

    const idToken =
        await firebaseUser.getIdToken();

    saveToken(idToken);

    const data =
        await backendLogin(idToken);

    return {
        ...data.data,
        idToken,
    };
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

export const requestPasswordReset = async (email) => {
    return firebaseRequestPasswordReset(email);
};

export const verifyResetCode = async (code) => {
    return firebaseVerifyPasswordResetCode(code);
};

export const confirmResetPassword = async (
    code,
    newPassword
) => {
    return firebaseConfirmPasswordReset(
        code,
        newPassword
    );
};

export const backendLogin = async (firebaseToken) => {
    const res = await api.post("/auth/firebase-login", {
        token: firebaseToken,
    });

    return res.data;
};
