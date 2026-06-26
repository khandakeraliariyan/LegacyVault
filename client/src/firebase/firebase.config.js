import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

function readEnv(key) {
    const value = import.meta.env[key];
    return typeof value === "string" ? value.trim().replace(/^["']|["']$/g, "") : value;
}

const firebaseConfig = {
    apiKey: readEnv("VITE_FIREBASE_API_KEY"),
    authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("VITE_FIREBASE_APP_ID"),
};

const missingKeys = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (missingKeys.length > 0) {
    console.error(
        `Firebase config missing: ${missingKeys.join(", ")}. Check client/.env and restart Vite.`
    );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;

export function isFirebaseConfigured() {
    return missingKeys.length === 0;
}
