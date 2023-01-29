const { transporter } = require("../config/Nodemailer.config")
const { promisify } = require("util")
const { fileURLToPath } = require("url")
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")
const { getVerifyAccountToken } = require("./auth.util")

// const __filename = fileURLToPath(import.meta.url);
const readFile = promisify(fs.readFile);
// const __dirname = path.dirname(__filename);

const resetPasswordMail = async (user, url) => {
    let filePath = path.join(__dirname, "..", "static", "resetPassword.html");
    let htmlFile = await readFile(filePath, 'utf-8');
    let template = handlebars.compile(htmlFile)
    let emailTemp = template({
        name: user.firstName,
        url: url
    })

    try {
        let info = await transporter.sendMail({
            from: '"Social Media App || Kamal" <coding.coding.everyday@gmail.com>',
            to: user.email,
            subject: "Reset Password || Social Media App",
            text: `Hi ${user.firstName}, we have sent you the link to reset your account password.`,
            html: emailTemp,
        });
        return `Message sent: ${info.messageId}`
    }
    catch (err) {
        return err.message
    }
}

const resetPasswordSuccessMail = async (user) => {
    let filePath = path.join(__dirname, "..", "static", "resetPasswordSuccess.html");
    let htmlFile = await readFile(filePath, 'utf-8');
    let template = handlebars.compile(htmlFile)
    let emailTemp = template({
        name: user.firstName,
    })

    try {
        let info = await transporter.sendMail({
            from: '"Social Media App || Kamal" <coding.coding.everyday@gmail.com>',
            to: user.email,
            subject: "Password Reset Success || Social Media App",
            text: `Hi ${user.firstName}, we have sent you this email because your account was reset successfully.`,
            html: emailTemp,
        });
        return `Message sent: ${info.messageId}`
    }
    catch (err) {
        return err.message
    }
}

const accountCreatedSuccessMail = async (user) => {
    let filePath = path.join(__dirname, "..", "static", "accountCreatedSuccess.html");
    let htmlFile = await readFile(filePath, 'utf-8');
    let template = handlebars.compile(htmlFile)
    const token = await getVerifyAccountToken(user)
    let emailTemp = template({
        name: user.firstName,
        url: `${process.env.CLIENT_URL}/verifyAccount/${token}`
    })

    try {
        let info = await transporter.sendMail({
            from: '"Social Media App || Kamal" <coding.coding.everyday@gmail.com>',
            to: user.email,
            subject: "Verify Your Account || Social Media App",
            text: `Hi ${user.firstName}, we have sent you this email because your account was successfully created.`,
            html: emailTemp,
        });
        return `Message sent: ${info.messageId}`
    }
    catch (err) {
        return err.message
    }
}

module.exports = {
    resetPasswordMail,
    resetPasswordSuccessMail,
    accountCreatedSuccessMail
}