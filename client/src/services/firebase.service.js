import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    sendPasswordResetEmail,
    verifyPasswordResetCode,
    confirmPasswordReset,
} from "firebase/auth";

import { auth } from "../firebase/firebase.config";

const provider = new GoogleAuthProvider();

export const firebaseRegister = async (
    name,
    email,
    password
) => {
    const result =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

    await updateProfile(result.user, {
        displayName: name,
    });

    return result.user;
};

export const firebaseLogin = (
    email,
    password
) => {
    return signInWithEmailAndPassword(
        auth,
        email,
        password
    );
};

export const firebaseGoogleLogin =
    () => {
        return signInWithPopup(
            auth,
            provider
        );
    };

export const firebaseLogout = () => {
    return signOut(auth);
};

export const firebaseRequestPasswordReset = (
    email
) => {
    return sendPasswordResetEmail(
        auth,
        email
    );
};

export const firebaseVerifyPasswordResetCode = (
    code
) => {
    return verifyPasswordResetCode(
        auth,
        code
    );
};

export const firebaseConfirmPasswordReset = (
    code,
    newPassword
) => {
    return confirmPasswordReset(
        auth,
        code,
        newPassword
    );
};
