const AUTH_MESSAGE_MAP = [
    {
        match: ({ code, message }) =>
            code === "auth/configuration-not-found"
            || message.includes("configuration-not-found")
            || message.includes("CONFIGURATION_NOT_FOUND"),
        text: "Authentication is not configured yet. Enable Firebase Authentication and try again.",
    },
    {
        match: ({ code, message }) =>
            code === "auth/invalid-credential"
            || code === "auth/wrong-password"
            || code === "auth/user-not-found"
            || message.includes("INVALID_LOGIN_CREDENTIALS")
            || message.includes("EMAIL_NOT_FOUND")
            || message.includes("INVALID_PASSWORD"),
        text: "Invalid email or password.",
    },
    {
        match: ({ code, message }) =>
            code === "auth/email-already-in-use"
            || message.includes("EMAIL_EXISTS"),
        text: "An account with this email already exists.",
    },
    {
        match: ({ code, message }) =>
            code === "auth/weak-password"
            || message.includes("WEAK_PASSWORD"),
        text: "Password is too weak. Use at least 6 characters.",
    },
    {
        match: ({ code, message }) =>
            code === "auth/too-many-requests"
            || message.includes("TOO_MANY_ATTEMPTS_TRY_LATER"),
        text: "Too many attempts. Please wait a moment and try again.",
    },
    {
        match: ({ code, message }) =>
            code === "auth/invalid-email"
            || message.includes("INVALID_EMAIL"),
        text: "Please enter a valid email address.",
    },
    {
        match: ({ code, message }) =>
            code === "auth/user-disabled"
            || message.includes("USER_DISABLED"),
        text: "This account has been disabled. Please contact support.",
    },
    {
        match: ({ code }) =>
            code === "auth/network-request-failed",
        text: "Network error. Please check your connection and try again.",
    },
    {
        match: ({ code }) =>
            code === "auth/popup-closed-by-user",
        text: "Google sign-in was cancelled before completion.",
    },
    {
        match: ({ code }) =>
            code === "auth/popup-blocked",
        text: "The sign-in popup was blocked by your browser. Please allow popups and try again.",
    },
    {
        match: ({ code }) =>
            code === "auth/account-exists-with-different-credential",
        text: "An account already exists with this email using a different sign-in method.",
    },
    {
        match: ({ code, message }) =>
            code === "auth/expired-action-code"
            || message.includes("EXPIRED_OOB_CODE"),
        text: "This password reset link has expired. Please request a new one.",
    },
    {
        match: ({ code, message }) =>
            code === "auth/invalid-action-code"
            || message.includes("INVALID_OOB_CODE"),
        text: "This password reset link is invalid or has already been used.",
    },
    {
        match: ({ message }) =>
            message.includes("MISSING_PASSWORD"),
        text: "Please enter your password.",
    },
    {
        match: ({ message }) =>
            message.includes("MISSING_EMAIL"),
        text: "Please enter your email address.",
    },
    {
        match: ({ message }) =>
            message.includes("FIREBASE_WEB_API_KEY is missing"),
        text: "Server authentication is not configured. Add the Firebase web API key to the server environment.",
    },
];

export function mapFirebaseAuthError(error) {
    const code = error?.code || "";
    const message = String(
        error?.response?.data?.message
        || error?.response?.data?.error
        || error?.message
        || ""
    );

    const matched = AUTH_MESSAGE_MAP.find((item) =>
        item.match({ code, message })
    );

    return matched?.text || null;
}

export function getFriendlyAuthErrorMessage(
    error,
    fallback = "Authentication failed."
) {
    return mapFirebaseAuthError(error) || fallback;
}
