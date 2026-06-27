require("../config/firebase");

const { getAuth } = require("firebase-admin/auth");

const User = require("../modules/user/user.model");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            await getAuth().verifyIdToken(token);

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
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};

module.exports = authMiddleware;
