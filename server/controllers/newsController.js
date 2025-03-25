const NewsPost = require("../models/NewsPost");

// Create a new news post
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

// Get all news posts (sorted by most recent)
const getAllNewsPosts = async (req, res) => {
  try {
    const posts = await NewsPost.find().sort({ postedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching news posts:", error);
    res.status(500).json({ error: "Failed to fetch news posts" });
  }
};

// Get a single news post by ID
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

// Update a news post by ID
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

// Delete a news post by ID
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
