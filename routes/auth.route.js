const authRouter = require("express").Router();
const { signUpHandler, loginHandler } = require("../controllers/auth.controller");

authRouter.post("/signup", signUpHandler);
authRouter.post("/login", loginHandler)

module.exports = authRouter;