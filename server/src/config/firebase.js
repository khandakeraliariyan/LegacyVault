const {
    cert,
    getApps,
    initializeApp,
} = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const privateKey = process.env.FIREBASE_PRIVATE_KEY
    .trim()
    .replace(/^"(.*)",$/s, "$1")
    .replace(/\\n/g, "\n");

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

const firebaseApp =
    getApps()[0] ||
    initializeApp({
        credential: cert(serviceAccount),
    });

module.exports = getAuth(firebaseApp);
