const User = require("../models/user.model");
const expressAsyncHandler = require("express-async-handler");

const handleGetUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id)

        if (!user) {
            res.status(404).json({
                status: false, message: "User not found."
            })
        } else {
            res.json({
                status: true, message: user
            })
        }
    }
    catch (err) {
        res.status(500).json({
            status: false, message: err.message || "Internal Server Error."
        })
    }
})

module.exports = {
    handleGetUser
}