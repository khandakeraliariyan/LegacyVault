const firebaseAuth = require("../../config/firebase");

const User = require("../user/user.model");

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

module.exports = {
    verifyFirebaseUser,
};
