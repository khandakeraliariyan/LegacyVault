const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const routes = require("./routes");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

const allowedOrigin = [
    "http://localhost:5173",
    "https://legacy-vault-roan.vercel.app",
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests without an Origin header (Postman, mobile apps, etc.)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/v1", routes);

app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "LegacyVault API Running",
    });
});

module.exports = app;
