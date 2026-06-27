const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const routes = require("./routes");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

const allowedOrigin =
    process.env.CLIENT_URL ||
    "http://localhost:5173";

app.use(
    cors({
        origin: allowedOrigin,
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
