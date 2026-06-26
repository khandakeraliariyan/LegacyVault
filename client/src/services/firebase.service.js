import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
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