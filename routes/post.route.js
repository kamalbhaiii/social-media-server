const postRouter = require("express").Router()
const { handleCreatePost, handleGetPost, handleGetPostsOfUser, handleDeletePost, handleUpdatePost } = require("../controllers/post.controller")
const { authenticate } = require("../middlewares/auth.middleware")

postRouter.post("/", authenticate, handleCreatePost);
postRouter.get("/:id", authenticate, handleGetPost);
postRouter.get("/", authenticate, handleGetPostsOfUser);
postRouter.delete("/:id", authenticate, handleDeletePost)
postRouter.put("/:id", authenticate, handleUpdatePost)

module.exports = postRouter;