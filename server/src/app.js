const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const routes = require("./routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1", routes);

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "LegacyVault API Running",
    });
});

module.exports = app;