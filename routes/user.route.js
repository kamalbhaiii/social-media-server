const userRouter = require("express").Router();
const { handleGetUser, handleDeleteUser, handleUpdateUser, handleGetAllUser, handleAddOrRemoveFriend } = require("../controllers/user.controller")
const { authenticate } = require("../middlewares/auth.middleware")

userRouter.get("/:id", authenticate, handleGetUser)
userRouter.put("/:id", authenticate, handleUpdateUser)
userRouter.delete("/:id", authenticate, handleDeleteUser)
userRouter.get("/", authenticate, handleGetAllUser)
userRouter.put("/", authenticate, handleAddOrRemoveFriend)

module.exports = userRouter;