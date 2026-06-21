const admin = require("../config/firebase");

const User = require("../modules/user/user.model");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            await admin
                .auth()
                .verifyIdToken(token);

        const user =
            await User.findOne({
                firebaseUid: decoded.uid,
            });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authMiddleware;