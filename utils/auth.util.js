const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const hashPassword = async (str) => {
    try {
        const genPassword = await bcrypt.hash(str, 12);
        return genPassword;
    } catch (err) {
        console.log(err.message)
    }
}

const checkPassword = async (originalPassword, hashedPassword) => {
    try {
        const check = await bcrypt.compare(originalPassword, hashedPassword);
        return check;
    } catch (err) {
        console.log(err.message)
    }
}

const genAuthToken = async (payload) => {
    try {
        const token = jwt.sign({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            username: payload.username,
            posts: payload.posts,
            friends: payload.friends,
            emailVerified: payload.emailVerified
        }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })
        return token;
    } catch (err) {
        console.log(err.message)
    }
}

const getResetPassToken = async (payload) => {
    try {
        const resetToken = jwt.sign({
            email: payload.email,
            username: payload.username
        }, process.env.JWT_RESET_PASSWORD_SECRET, {
            expiresIn: "10m"
        })
        return resetToken
    }
    catch (err) {
        return err
    }
}

const getVerifyAccountToken = async (payload) => {
    try {
        const verifyAccountToken = jwt.sign({
            email: payload.email, username: payload.username
        }, process.env.JWT_VERIFY_ACCOUNT_SECRET, {
            expiresIn: "10d"
        })

        return verifyAccountToken
    }
    catch (err) {
        return err;
    }
}

module.exports = { hashPassword, checkPassword, genAuthToken, getResetPassToken, getVerifyAccountToken };