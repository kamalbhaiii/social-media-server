const expressAsyncHandler = require("express-async-handler")
const Post = require("../models/post.model")
const User = require("../models/user.model")
const { removePostFromUser } = require("../utils/post.util")

const handleCreatePost = expressAsyncHandler(async (req, res) => {
    const body = req.body;
    try {
        const createPost = new Post(body);
        if (createPost) {
            const user = await User.findById(req.user._id);

            if (user) {
                user.posts.push(createPost._id)
                await createPost.save()
                await user.save()

                res.json({
                    status: true, message: "Post has been successfully created."
                })
            } else {
                res.status(401).json({
                    status: false, message: "You're not authorized to perform this action."
                })
            }
        }
        else {
            res.status(403).json({
                status: false, message: "Post can't be created."
            })
        }
    }
    catch (err) {
        res.status(500).json({
            status: false, message: err.message || "Internal Server Error."
        })
    }
})

const handleGetPost = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);

        if (post) {
            res.json({
                status: true, message: post
            })
        } else {
            res.status(404).json({
                status: false, message: "Post doesn't exists."
            })
        }
    }
    catch (err) {
        res.status(500).json({
            status: false, message: err.message || "Internal Server Error."
        })
    }
})

const handleGetPostsOfUser = expressAsyncHandler(async (req, res) => {
    const { userId } = req.query;
    try {
        const user = await User.findById(userId).populate("posts");

        res.status(200).json({
            status: true, message: user.posts
        })
    }
    catch (err) {
        res.status(500).json({
            status: false, message: err.message || "Internal Server Error."
        })
    }
})

const handleDeletePost = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.posts.includes(id)) {
            const post = await Post.findByIdAndDelete(id);
            const user = await User.findOne({ email: req.user.email })
            user.posts = removePostFromUser(req.user.posts, id)

            if (post) {
                await user.save()

                res.json({
                    status: true, message: `${post._id} has been deleted.`
                })
            } else {
                res.status(404).json({
                    status: true, message: "Post couldn't be deleted due to unknown reason."
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

const handleUpdatePost = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    try {
        if (req.user.posts.includes(id)) {
            const updatedPost = await Post.findByIdAndUpdate(id, body, { new: true })

            if (updatedPost) {
                res.json({
                    status: true, message: updatedPost
                })
            } else {
                res.status(404).json({
                    status: false, message: "Post couldn't be updated due to unknown reason."
                })
            }
        }
        else {
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

module.exports = {
    handleCreatePost,
    handleGetPost,
    handleGetPostsOfUser,
    handleDeletePost,
    handleUpdatePost
}