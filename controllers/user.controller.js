const User = require("../models/user.model");
const expressAsyncHandler = require("express-async-handler");
const { findFriendAndRemove } = require("../utils/user.util");
const { find } = require("../models/user.model");

const handleGetUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).populate("friends")

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

const handleUpdateUser = expressAsyncHandler(async (req, res) => {
    const body = req.body;
    const { id } = req.params;
    try {
        const user = await User.findOne({ id })
        if (req.user.email === user.email) {
            const updateUser = await User.findByIdAndUpdate(user._id, body, { new: true })

            if (updateUser) {
                res.json({
                    status: true, message: updateUser
                })
            }
        } else {
            res.status(401).json({
                status: false, message: "You're not authorized to perform this action."
            })
        }
    }
    catch (err) {
        res.status(500).json({
            status: false, message: err.message || "Internal Server Error."
        })
    }
})

const handleDeleteUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (req.user.email === user.email) {
            const userDelete = await User.findByIdAndDelete(user._id);

            if (userDelete) {
                res.json({
                    status: true, message: "User has been deleted."
                })
            } else {
                res.status(404).json({
                    status: false, message: "User didn't deleted either because user wasn't found or something else."
                })
            }
        } else {
            res.status(401).json({
                status: false, message: "You're not authorized to perform this action."
            })
        }
    }
    catch (err) {
        res.status(500).json({
            status: false, message: err.message || "Internal Server Error."
        })
    }
})

const handleGetAllUser = expressAsyncHandler(async (req, res) => {
    try {
        const users = await User.find().populate("friends");

        res.json({
            status: true, message: users
        })
    }
    catch (err) {
        res.status(500).json({
            status: false, message: err.message || "Internal Server Error."
        })
    }
})

const handleAddOrRemoveFriend = expressAsyncHandler(async (req, res) => {
    const { addFriend } = req.query;
    try {
        const friendExist = await User.findById(addFriend);
        const you = await User.findOne({ email: req.user.email })

        if (friendExist && you) {
            if (you.friends.includes(friendExist._id)) {
                you.friends = findFriendAndRemove(you.friends, friendExist._id)
                friendExist.friends = findFriendAndRemove(friendExist.friends, you._id)

                you.save()
                friendExist.save()
                res.json({
                    status: true, message: `${friendExist.username} removed as Friend.`
                })
            } else {
                you.friends.push(friendExist._id)
                friendExist.friends.push(you._id)
                await you.save()
                await friendExist.save()

                res.json({
                    status: true, message: `${friendExist.username} added as Friend.`
                })
            }
        } else {
            res.status(404).json({
                status: false, message: "User not found."
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
    handleGetUser,
    handleUpdateUser,
    handleDeleteUser,
    handleGetAllUser,
    handleAddOrRemoveFriend
}