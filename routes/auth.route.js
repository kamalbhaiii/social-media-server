const authRouter = require("express").Router();
const { signUpHandler, loginHandler, forgetPasswordHandler, resetPasswordHandler } = require("../controllers/auth.controller");
const { authenticateResetPass } = require("../middlewares/auth.middleware");

authRouter.post("/signup", signUpHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/forgetPassword", forgetPasswordHandler)
authRouter.post("/resetPassword", authenticateResetPass, resetPasswordHandler)

module.exports = authRouter;