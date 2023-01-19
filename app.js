const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();
require("./utils/database.util")
const authRoutes = require("./routes/auth.route")
const userRoutes = require("./routes/user.route")

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("combined"))
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)

app.get("/api/v1", expressAsyncHandler(async (req, res) => {
    res.json({
        status: true,
        message: "Server is live."
    })
}))

module.exports = app;