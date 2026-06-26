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

const loginWithEmail = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.loginWithEmail(
            email,
            password
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const registerWithEmail = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const result = await authService.registerWithEmail(
            name,
            email,
            password
        );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: result,
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
    loginWithEmail,
    registerWithEmail,
    getMe,
};