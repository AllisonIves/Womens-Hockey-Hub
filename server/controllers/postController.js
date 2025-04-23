/**
 * @file Controller for handling forum post and reply operations.
 * Includes logic for creating, reading, updating, and deleting posts and replies,
 * along with banned word checks and category filtering.
 */

const Post = require('../models/post');
const containsBannedWord = require('../utilities/checkBannedWords');

// REST API

/**
 * Get all forum posts.
 * @route GET /api/post
 */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get a single post by UUID.
 * @route GET /api/post/id/:postId
 */
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

/**
 * Get all posts within a specific category.
 * @route GET /api/post/category/:category
 */
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

/**
 * Update the contents of a forum post.
 * @route PUT /api/post/id/:postId
 * @bodyParam {string} [contents]
 * @bodyParam {boolean} [isEdited]
 */
exports.updateForumPost = [
  body('contents').optional().isString().withMessage('Contents must be a string'),
  body('isEdited').optional().isBoolean().withMessage('isEdited must be a boolean'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { contents } = req.body;

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

/**
 * Create a reply to a forum post.
 * @route POST /api/post/:postId/reply
 * @bodyParam {string} userName
 * @bodyParam {string} contents
 */
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

/**
 * Update a reply on a post.
 * @route PUT /api/post/id/:postId/reply/:replyId
 * @bodyParam {string} [contents]
 */
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


/**
 * Delete a single forum post by UUID.
 * @route DELETE /api/forum/id/:id
 */
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

/**
 * Delete all forum posts.
 * @route DELETE /api/forum
 */
exports.deleteAllPosts = async (req, res) => {
  try {
    const result = await Post.deleteMany({});
    res.status(200).json({ message: `Deleted ${result.deletedCount} post(s).` });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete posts.", error: err.message });
  }
};

/**
 * Get all unique forum post categories.
 * @route GET /api/forum/categories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const posts = await Post.find().select("Category -_id");
    const categories = [...new Set(posts.map(post => post.Category))];
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
