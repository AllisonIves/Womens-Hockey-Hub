const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    contents: { type: String, required: true },
    Category: { type: String },
    isEdited: { type: Boolean, default: false }, //Default false for edited
    isPinned: { type: Boolean, default: false } //Default false for pinned
  }, { timestamps: true });
  
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
