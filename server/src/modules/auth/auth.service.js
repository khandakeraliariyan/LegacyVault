const firebaseAuth = require("../../config/firebase");

const User = require("../user/user.model");

const firebaseRest = require("./firebaseRest.service");

const { getAuth } = require("firebase-admin/auth");

const verifyFirebaseUser = async (token) => {
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    const firebaseUid = decodedToken.uid;

    const email = decodedToken.email;

    const name =
        decodedToken.name ||
        email.split("@")[0];

    let user = await User.findOne({
        firebaseUid,
    });

    if (!user) {
        user = await User.create({
            firebaseUid,
            email,
            name,
            role: "USER",
        });
    }

    return user;
};

const loginWithEmail = async (email, password) => {
    const authResult = await firebaseRest.signInWithPassword(
        email,
        password
    );

    const user = await verifyFirebaseUser(authResult.idToken);

    return {
        idToken: authResult.idToken,
        refreshToken: authResult.refreshToken,
        user,
    };
};

const registerWithEmail = async (name, email, password) => {
    const authResult = await firebaseRest.signUpWithPassword(
        email,
        password
    );

    await getAuth().updateUser(authResult.localId, {
        displayName: name,
    });

    const user = await verifyFirebaseUser(authResult.idToken);

    return {
        idToken: authResult.idToken,
        refreshToken: authResult.refreshToken,
        user,
    };
};

module.exports = {
    verifyFirebaseUser,
    loginWithEmail,
    registerWithEmail,
};
