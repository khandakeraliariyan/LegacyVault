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
    fetchCurrentUser,
} from "../services/token.service";

import { getToken, removeToken } from "../utils/storage";

export const AuthContext = createContext();

function toAuthUser(profile) {
    if (!profile) {
        return null;
    }

    return {
        uid: profile.firebaseUid,
        email: profile.email,
        displayName: profile.name,
    };
}

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const syncBackend = async (firebaseUser) => {
        const firebaseToken = await firebaseUser.getIdToken();
        await exchangeFirebaseToken(firebaseToken);
        const currentUser = await fetchCurrentUser();
        setProfile(currentUser);
        return currentUser;
    };

    const hydrateFromStoredToken = async () => {
        const token = getToken();

        if (!token) {
            return false;
        }

        try {
            const currentUser = await fetchCurrentUser();
            setProfile(currentUser);
            setUser(toAuthUser(currentUser));
            return true;
        } catch {
            removeToken();
            setProfile(null);
            setUser(null);
            return false;
        }
    };

    const refreshProfile = async () => {
        const currentUser = await fetchCurrentUser();
        setProfile(currentUser);
        setUser(toAuthUser(currentUser));
        return currentUser;
    };

    const login = async (email, password) => {
        const result = await loginUser(email, password);
        setProfile(result.user);
        setUser(toAuthUser(result.user));
        return result;
    };

    const register = async (name, email, password) => {
        const result = await registerUser(name, email, password);
        setProfile(result.user);
        setUser(toAuthUser(result.user));
        return result;
    };

    const googleSignIn = async () => {
        const result = await googleLogin();
        await syncBackend(result.user);
        setUser(result.user);
        return result;
    };

    const logout = async () => {
        removeToken();
        setProfile(null);
        setUser(null);
        await logoutUser();
    };

    useEffect(() => {
        let active = true;

        const bootstrap = async () => {
            await hydrateFromStoredToken();

            const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                if (!active) {
                    return;
                }

                if (currentUser) {
                    setUser(currentUser);

                    try {
                        const idToken = await currentUser.getIdToken();
                        localStorage.setItem("accessToken", idToken);
                        await syncBackend(currentUser);
                    } catch {
                        setProfile(null);
                    }
                } else if (!getToken()) {
                    setUser(null);
                    setProfile(null);
                }

                setLoading(false);
            });

            if (!auth.currentUser && !getToken()) {
                setLoading(false);
            }

            return unsubscribe;
        };

        let unsubscribePromise = bootstrap();

        return () => {
            active = false;
            unsubscribePromise.then((unsubscribe) => unsubscribe?.());
        };
    }, []);

    const value = {
        user,
        profile,
        loading,
        login,
        register,
        logout,
        googleSignIn,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
