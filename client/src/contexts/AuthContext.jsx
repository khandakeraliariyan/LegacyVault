import {
    createContext,
    useEffect,
    useState,
} from "react";

import {
    onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase/firebase.config";

import {
    loginUser,
    registerUser,
    googleLogin,
    logoutUser,
} from "../services/auth.service";

import {
    exchangeFirebaseToken,
} from "../services/token.service";

export const AuthContext =
    createContext();

export default function AuthProvider({
    children,
}) {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const syncBackend =
        async (firebaseUser) => {

            const firebaseToken =
                await firebaseUser.getIdToken();

            const response =
                await exchangeFirebaseToken(
                    firebaseToken
                );

            const accessToken =
                response?.accessToken
                ?? response?.data?.accessToken;

            if (!accessToken) {
                return;
            }

            localStorage.setItem(
                "accessToken",
                accessToken
            );

        };

    const login =
        async (
            email,
            password
        ) => {

            const result =
                await loginUser(
                    email,
                    password
                );

            await syncBackend(
                result.user
            );

            return result;

        };

    const register =
        async (
            name,
            email,
            password
        ) => {

            const result =
                await registerUser(
                    name,
                    email,
                    password
                );

            await syncBackend(
                result.user
            );

            return result;

        };

    const googleSignIn =
        async () => {

            const result =
                await googleLogin();

            await syncBackend(
                result.user
            );

            return result;

        };

    const logout =
        async () => {

            localStorage.removeItem(
                "accessToken"
            );

            await logoutUser();

        };

    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                async (
                    currentUser
                ) => {

                    setUser(
                        currentUser
                    );

                    setLoading(
                        false
                    );

                }
            );

        return unsubscribe;

    }, []);

    const value = {

        user,

        loading,

        login,

        register,

        logout,

        googleSignIn,

    };

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );

}
