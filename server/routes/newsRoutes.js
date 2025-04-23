/**
 * Routes for managing news articles displayed on the homepage.
 *
 * Handles:
 * - Creating news posts
 * - Fetching all news posts or a specific one by ID
 * - Updating and deleting news posts
 *
 * Connected controller: ../controllers/newsController.js
 */

const express = require("express");
const router = express.Router();
const {
  createNewsPost,
  getAllNewsPosts,
  getNewsPostById,
  updateNewsPost,
  deleteNewsPost,
} = require("../controllers/newsController");

/**
 * @route POST /api/news
 * @desc Create a new news post
 */
router.post("/", createNewsPost);

/**
 * @route GET /api/news
 * @desc Get all news posts (sorted by newest first)
 */
router.get("/", getAllNewsPosts);

/**
 * @route GET /api/news/:id
 * @desc Get a single news post by its MongoDB _id
 */
router.get("/:id", getNewsPostById);

/**
 * @route PUT /api/news/:id
 * @desc Update a news post by its ID
 */
router.put("/:id", updateNewsPost);

/**
 * @route DELETE /api/news/:id
 * @desc Delete a news post by its ID
 */
router.delete("/:id", deleteNewsPost);

module.exports = router;