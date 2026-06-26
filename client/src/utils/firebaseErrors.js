export function mapFirebaseAuthError(error) {
    const code = error?.code || "";
    const message = error?.message || "";

    if (
        code === "auth/configuration-not-found"
        || message.includes("configuration-not-found")
        || message.includes("CONFIGURATION_NOT_FOUND")
    ) {
        return "Firebase Authentication is not set up yet. Open Firebase Console → Authentication → Get Started, enable Email/Password under Sign-in method, then try again.";
    }

    if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        return "Invalid email or password.";
    }

    if (code === "auth/email-already-in-use") {
        return "An account with this email already exists.";
    }

    if (code === "auth/weak-password") {
        return "Password is too weak. Use at least 6 characters.";
    }

    if (code === "auth/too-many-requests") {
        return "Too many attempts. Please wait a moment and try again.";
    }

    if (message.includes("INVALID_LOGIN_CREDENTIALS")) {
        return "Invalid email or password.";
    }

    if (message.includes("EMAIL_EXISTS")) {
        return "An account with this email already exists.";
    }

    if (message.includes("FIREBASE_WEB_API_KEY is missing")) {
        return "Server auth is not configured. Add FIREBASE_WEB_API_KEY to server/.env (same value as VITE_FIREBASE_API_KEY).";
    }

    return message || "Authentication failed.";
}
