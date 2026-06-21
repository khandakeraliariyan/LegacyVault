const authService = require("./auth.service");

const firebaseLogin = async (req, res, next) => {
    try {
        const { token } = req.body;

        const user =
            await authService.verifyFirebaseUser(
                token
            );

        res.status(200).json({
            success: true,
            message:
                "Authentication successful",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    firebaseLogin,
    getMe,
};