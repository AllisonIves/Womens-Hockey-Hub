/**
 * @file Defines the Mongoose schemas for forum posts and embedded replies.
 * Includes a child `replySchema` and parent `postSchema`, used to manage
 * threaded discussions in the forum feature.
 */

const mongoose = require("mongoose");

/**
 * Schema for a reply to a forum post.
 * This is used as a child of the Post schema.
 */
const replySchema = new mongoose.Schema({
  /** Display name of the user who wrote the reply */
  userName: { type: String, required: true }, 
  
  /** Text content of the reply */
  contents: { type: String, required: true }, 
  
  /** Whether the reply has been edited, set to false by default */
  isEdited: { type: Boolean, default: false }, 
  
  /** Timestamp of when the reply was created */
  createdAt: { type: Date, default: Date.now }, 
  
  /** Timestamp of the most recent update to the reply */
  updatedAt: { type: Date, default: Date.now }, 
});

/**
 * Schema for a forum post. Each post may contain multiple replies.
 */
const postSchema = new mongoose.Schema(
  {
    /** Custom UUID string (not Mongo _id) used as post identifier */
    id: { type: String, required: true, unique: true },
    
    /** Username of the post author */
    userName: { type: String, required: true },
    
    /** Text body of the post */
    contents: { type: String, required: true },
    
    /** Category label (used for filtering posts by type) */
    Category: { type: String },
    
    /** Whether the post has been edited (default set to false) */
    isEdited: { type: Boolean, default: false },
    
    /** Whether the post is pinned to the top of the list (default set to false) */
    isPinned: { type: Boolean, default: false },
    
    /** Array of embedded reply children */
    replies: [replySchema],
  },
  
  { timestamps: true } // Adds createdAt and updatedAt to the post itself
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;