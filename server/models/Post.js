const mongoose = require("mongoose");

//Reply schema -- child of post
const replySchema = new mongoose.Schema({
  userName: { type: String, required: true }, //User replying
  contents: { type: String, required: true }, //Content ofreply
  isEdited: { type: Boolean, default: false }, //Default false for edited replies
  createdAt: { type: Date, default: Date.now }, //Timestamp of when the reply was created
  updatedAt: { type: Date, default: Date.now }, //Timestamp of when the reply was last updated
});

//Post schema
const postSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    contents: { type: String, required: true },
    Category: { type: String },
    isEdited: { type: Boolean, default: false }, //Default false for edited
    isPinned: { type: Boolean, default: false }, //Default false for pinned
    replies: [replySchema], //Add replies as aarray
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;