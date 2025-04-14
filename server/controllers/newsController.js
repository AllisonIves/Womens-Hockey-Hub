/**
 * @file Controller for managing news posts on homepage.
 * Provides routes for creating, retrieving, updating, and deleting news articles.
 */

const NewsPost = require("../models/NewsPost");

/**
 * Creates a new news post.
 * @route POST /api/news
 * @access Admin
 */
const createNewsPost = async (req, res) => {
  try {
    const { title, content, author, imageURL, tags } = req.body;

    const newPost = new NewsPost({
      title,
      content,
      author,
      imageURL,
      tags,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating news post:", error);
    res.status(500).json({ error: "Failed to create news post" });
  }
};

/**
 * Fetches all news posts, sorted by most recent.
 * @route GET /api/news
 * @access Public
 */
const getAllNewsPosts = async (req, res) => {
  try {
    const posts = await NewsPost.find().sort({ postedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching news posts:", error);
    res.status(500).json({ error: "Failed to fetch news posts" });
  }
};

/**
 * Fetches a single news post by ID.
 * @route GET /api/news/:id
 * @access Public
 */
const getNewsPostById = async (req, res) => {
  try {
    const post = await NewsPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "News post not found" });
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    res.status(500).json({ error: "Failed to fetch news post" });
  }
};

/**
 * Updates a news post by ID.
 * @route PUT /api/news/:id
 * @access Admin
 */
const updateNewsPost = async (req, res) => {
  try {
    const { title, content, author, imageURL, tags } = req.body;

    const updatedPost = await NewsPost.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        author,
        imageURL,
        tags,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ error: "News post not found" });
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating news post:", error);
    res.status(500).json({ error: "Failed to update news post" });
  }
};

/**
 * Deletes a news post by ID.
 * @route DELETE /api/news/:id
 * @access Admin
 */
const deleteNewsPost = async (req, res) => {
  try {
    const deletedPost = await NewsPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ error: "News post not found" });
    res.status(200).json({ message: "News post deleted" });
  } catch (error) {
    console.error("Error deleting news post:", error);
    res.status(500).json({ error: "Failed to delete news post" });
  }
};

module.exports = {
  createNewsPost,
  getAllNewsPosts,
  getNewsPostById,
  updateNewsPost,
  deleteNewsPost,
};
