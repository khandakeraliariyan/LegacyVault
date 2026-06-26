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

import { removeToken } from "../utils/storage";

export const AuthContext = createContext();

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

    const refreshProfile = async () => {
        if (!auth.currentUser) {
            setProfile(null);
            return null;
        }

        const currentUser = await fetchCurrentUser();
        setProfile(currentUser);
        return currentUser;
    };

    const login = async (email, password) => {
        const result = await loginUser(email, password);
        await syncBackend(result.user);
        return result;
    };

    const register = async (name, email, password) => {
        const result = await registerUser(name, email, password);
        await syncBackend(result.user);
        return result;
    };

    const googleSignIn = async () => {
        const result = await googleLogin();
        await syncBackend(result.user);
        return result;
    };

    const logout = async () => {
        removeToken();
        setProfile(null);
        await logoutUser();
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    await syncBackend(currentUser);
                } catch {
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
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
