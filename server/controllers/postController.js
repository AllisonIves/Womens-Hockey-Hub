const Post = require('../models/post');
const containsBannedWord = require('../utilities/checkBannedWords');

// REST API

// GET /api/post
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostsById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ id: postId });

    if (!post) {
      return res.status(404).json({ message: "No post found with this ID." });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/post/category/:category
exports.getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await Post.find({ Category: category });

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this category." });
    }

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE forum post
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

exports.createForumPost = [
  body('contents').isString().notEmpty().withMessage('Contents are required'),
  body('Category').optional().isString(),
  body('isPinned').optional().isBoolean(),
  body('isEdited').optional().isBoolean(),
  body('replies').optional().isArray(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userName, contents, Category, isEdited, isPinned, replies } = req.body;

    if (containsBannedWord(contents)) {
      return res.status(400).json({ error: "Your post contains banned word(s). Please remove them and try again." });
    }

    try {
      const id = uuidv4();

      const newPost = new Post({
        id,
        userName,
        contents,
        Category,
        isEdited,
        isPinned,
        replies
      });

      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error) {
      console.error("Error creating forum post:", error);
      res.status(500).json({ error: "Failed to create forum post" });
    }
  }
];

// UPDATE forum post
exports.updateForumPost = [
  body('contents').optional().isString().withMessage('Contents must be a string'),
  body('isEdited').optional().isBoolean().withMessage('isEdited must be a boolean'),
  body('isPinned').optional().isBoolean().withMessage('isPinned must be a boolean'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { contents, isPinned } = req.body;

    if (contents && containsBannedWord(contents)) {
      return res.status(400).json({ error: "Your post contains banned word(s). Please remove them and try again." });
    }

    try {
      const { postId } = req.params;
      const post = await Post.findOne({ id: postId });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (contents !== undefined) {
        post.contents = contents;
        post.isPinned = isPinned;
        post.isEdited = true;
      }

      const updatedPost = await post.save();
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Error updating:", error);
      res.status(500).json({ error: 'Failed to update' });
    }
  }
];

// CREATE reply
exports.createReply = [
  body('contents').isString().notEmpty().withMessage('Reply cannot be empty'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userName, contents } = req.body;
    const { postId } = req.params;

    if (containsBannedWord(contents)) {
      return res.status(400).json({ error: "Your reply contains banned word(s). Please remove them and try again." });
    }

    try {
      const post = await Post.findOne({ id: postId });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const newReply = {
        userName,
        contents,
        isEdited: false,
      };

      post.replies.push(newReply);
      const updatedPost = await post.save();

      res.status(201).json(updatedPost);
    } catch (error) {
      console.error("Error creating reply:", error);
      res.status(500).json({ error: "Failed to create reply" });
    }
  }
];

// UPDATE reply
exports.updateReply = [
  body('contents').optional().isString().withMessage('Reply content must be a string'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { contents } = req.body;
    const { postId, replyId } = req.params;

    if (contents && containsBannedWord(contents)) {
      return res.status(400).json({ error: "Your reply contains banned word(s). Please remove them and try again." });
    }

    try {
      const post = await Post.findOne({ id: postId });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const reply = post.replies.id(replyId);
      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }

      if (contents !== undefined) {
        reply.contents = contents;
        reply.isEdited = true;
      }

      const updatedPost = await post.save();
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Error updating reply:", error);
      res.status(500).json({ error: "Failed to update reply" });
    }
  }
];

// DELETE /api/forum/id/:id
exports.deletePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findOneAndDelete({ id });

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post.", error: err.message });
  }
};

// DELETE ALL /api/forum
exports.deleteAllPosts = async (req, res) => {
  try {
    const result = await Post.deleteMany({});
    res.status(200).json({ message: `Deleted ${result.deletedCount} post(s).` });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete posts.", error: err.message });
  }
};

// GET /api/forum/categories
exports.getAllCategories = async (req, res) => {
  try {
    const posts = await Post.find().select("Category -_id");
    const categories = [...new Set(posts.map(post => post.Category))];
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
