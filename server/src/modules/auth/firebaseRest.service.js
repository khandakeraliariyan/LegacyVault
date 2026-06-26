const fs = require("fs");
const path = require("path");

function loadFirebaseWebApiKey() {
    if (process.env.FIREBASE_WEB_API_KEY) {
        return process.env.FIREBASE_WEB_API_KEY.trim().replace(/^["']|["']$/g, "");
    }

    try {
        const clientEnvPath = path.resolve(
            __dirname,
            "../../../../client/.env"
        );
        const clientEnv = fs.readFileSync(clientEnvPath, "utf8");
        const match = clientEnv.match(/^VITE_FIREBASE_API_KEY=(.+)$/m);

        if (match?.[1]) {
            return match[1].trim().replace(/^["']|["']$/g, "");
        }
    } catch {
        // Ignore missing client env in production deployments.
    }

    return null;
}

const FIREBASE_WEB_API_KEY = loadFirebaseWebApiKey();

const IDENTITY_TOOLKIT_BASE =
    "https://identitytoolkit.googleapis.com/v1";

async function callIdentityToolkit(endpoint, payload) {
    if (!FIREBASE_WEB_API_KEY) {
        throw new Error(
            "FIREBASE_WEB_API_KEY is missing in server environment"
        );
    }

    const response = await fetch(
        `${IDENTITY_TOOLKIT_BASE}/${endpoint}?key=${FIREBASE_WEB_API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const message =
            data?.error?.message ||
            "Firebase authentication request failed";

        throw new Error(message);
    }

    return data;
}

const signInWithPassword = (email, password) =>
    callIdentityToolkit("accounts:signInWithPassword", {
        email,
        password,
        returnSecureToken: true,
    });

const signUpWithPassword = (email, password) =>
    callIdentityToolkit("accounts:signUp", {
        email,
        password,
        returnSecureToken: true,
    });

module.exports = {
    signInWithPassword,
    signUpWithPassword,
};
