const userRouter = require("express").Router();
const { handleGetUser } = require("../controllers/user.controller")
const { authenticate } = require("../middlewares/auth.middleware")

userRouter.get("/:id", authenticate, handleGetUser)

module.exports = userRouter;