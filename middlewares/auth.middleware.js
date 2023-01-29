const jwt = require("jsonwebtoken");
const User = require("../models/user.model")
const expressAsyncHandler = require("express-async-handler")

const authenticate = expressAsyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (!authorization) {
            res.status(403).json({
                status: false, message: "Auth Token is required to proceed this request."
            })
        } else {
            if (authorization.startsWith("Bearer")) {
                const { email } = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET || process.env.JWT_VERIFY_ACCOUNT_SECRET);

                if (email) {
                    const user = await User.findOne({ email });

                    if (user) {
                        req.user = user;
                        next();
                    } else {
                        res.status(401).json({
                            status: false, message: "Auth token is either incorrect or expired."
                        })
                    }
                } else {
                    res.status(401).json({
                        status: false, message: "Auth token is either incorrect or expired."
                    })
                }
            } else {
                res.status(403).json({
                    status: false, message: "Auth Token format is incorrect."
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

const authenticateResetPass = expressAsyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (!authorization) {
            res.status(403).json({
                status: false, message: "Auth Token is required to proceed this request."
            })
        } else {
            if (authorization.startsWith("Bearer")) {
                const { email } = jwt.verify(authorization.split(" ")[1], process.env.JWT_RESET_PASSWORD_SECRET);

                if (email) {
                    const user = await User.findOne({ email }).select("+password");

                    if (user) {
                        req.user = user;
                        next();
                    } else {
                        res.status(401).json({
                            status: false, message: "Auth token is either incorrect or expired."
                        })
                    }
                } else {
                    res.status(401).json({
                        status: false, message: "Auth token is either incorrect or expired."
                    })
                }
            } else {
                res.status(403).json({
                    status: false, message: "Auth Token format is incorrect."
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
    authenticate,
    authenticateResetPass
}