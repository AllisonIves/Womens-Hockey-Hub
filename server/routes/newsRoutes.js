const express = require("express");
const router = express.Router();
const {
  createNewsPost,
  getAllNewsPosts,
  getNewsPostById,
  updateNewsPost,
  deleteNewsPost,
} = require("../controllers/newsController");

// POST /api/news - Create a new news post
router.post("/", createNewsPost);

// GET /api/news - Get all news posts
router.get("/", getAllNewsPosts);

// GET /api/news/:id - Get a single news post by ID
router.get("/:id", getNewsPostById);

// PUT /api/news/:id - Update a news post by ID
router.put("/:id", updateNewsPost);

// DELETE /api/news/:id - Delete a news post by ID
router.delete("/:id", deleteNewsPost);

module.exports = router;