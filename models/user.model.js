const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    avatar: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    password: { type: String, required: true, min: 6, select: false }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);

module.exports = User;