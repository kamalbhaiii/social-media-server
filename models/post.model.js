const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    images: { type: String },
    caption: { type: String, max: 250 },
    hashTags: [{ type: String }],
    location: { type: String },
    likes: { type: Number, default: 0 }
}, {
    timestamps: true
})

const Post = mongoose.model("Post", postSchema);

module.exports = Post;