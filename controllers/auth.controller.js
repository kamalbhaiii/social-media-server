const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user.model")
const { hashPassword, checkPassword, genAuthToken, getResetPassToken } = require("../utils/auth.util");
const { resetPasswordMail, resetPasswordSuccessMail, accountCreatedSuccessMail } = require("../utils/email.util");

const signUpHandler = expressAsyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;

    try {
        if (!firstName || !email || !password || !username) {
            res.status(412).json({
                status: false, message: "Some requried fields are missing."
            })
        }
        else {
            const userExist = await User.findOne({ email });

            if (userExist) {
                res.status(409).json({
                    status: false, message: "Email id is already registered to a user."
                })
            } else {
                const userNameExist = await User.findOne({ username })

                if (userNameExist) {
                    res.status(409).json({
                        status: false, message: "Username is already registered to a user."
                    })
                } else {
                    const user = new User({ firstName, lastName, email, password: await hashPassword(password), username })
                    await user.save()

                    await accountCreatedSuccessMail(user)

                    res.json({
                        status: true, message: "User registered successfully."
                    })
                }
            }
        }
    }
    catch (err) {
        res.status(500).json({
            status: false, message: err.message || "Internal server error."
        })
    }
})

const loginHandler = expressAsyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    try {
        if ((email && password) || (username && password)) {
            if (email) {
                const userExist = await User.findOne({ email }).select("+password")
                if (userExist) {
                    if (await checkPassword(password, userExist.password)) {
                        const token = await genAuthToken(await User.findOne({ email }))
                        res.json({
                            status: true, message: token
                        })
                    } else {
                        res.status(401).json({
                            status: false, message: "Provided credentials are incorrect."
                        })
                    }
                } else {
                    res.status(401).json({
                        status: false, message: "Provided credentials are incorrect."
                    })
                }
            } else {
                const userExist = await User.findOne({ username }).select("+password")
                if (userExist) {
                    if (await checkPassword(password, userExist.password)) {
                        const token = await genAuthToken(await User.findOne({ username }))
                        res.json({
                            status: true, message: token
                        })
                    } else {
                        res.status(401).json({
                            status: false, message: "Provided credentials are incorrect."
                        })
                    }
                } else {
                    res.status(401).json({
                        status: false, message: "Provided credentials are incorrect."
                    })
                }
            }
        }
        else {
            res.status(412).json({
                status: false, message: "Some requried fields are missing."
            })
        }
    } catch (err) {
        res.status(500).json({
            status: false, message: err.message || "Internal server error."
        })
    }
})

const forgetPasswordHandler = expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            res.status(409).json({
                status: false, message: "Email is a required field."
            })
        } else {
            const userExist = await User.findOne({ email });

            if (userExist) {
                const resetToken = await getResetPassToken(userExist);
                const resetUrl = `${process.env.CLIENT_URL}/resetPassword/${resetToken}`;

                await resetPasswordMail(userExist, resetUrl)

                res.json({
                    status: true, message: "Reset password link has been sent to registered email address."
                })
            } else {
                res.status(404).json({
                    status: false, message: "This email id is not registered."
                })
            }
        }
    }
    catch (err) {
        res.status(500).json({
            status: false, message: err.message || "Internal Server Error"
        })
    }
})

const resetPasswordHandler = expressAsyncHandler(async (req, res) => {
    const { password } = req.body;
    try {
        if (!password) {
            res.status(409).json({
                status: false, message: "Password is a required Field."
            })
        } else {
            if (await checkPassword(password, req.user.password)) {
                res.status(403).json({
                    status: false, message: "New password cannot be same as the old password."
                })
            } else {
                const user = await User.findById(req.user._id).select("+password");

                user.password = await hashPassword(password)
                await user.save()

                await resetPasswordSuccessMail(user)

                res.json({
                    status: true, message: "Password has been changed Successfully."
                })
            }
        }
    }
    catch (err) {
        res.status(500).json({
            status: false, message: err.message || "Internal Server Error."
        })
    }
})

module.exports = {
    signUpHandler,
    loginHandler,
    forgetPasswordHandler,
    resetPasswordHandler
}