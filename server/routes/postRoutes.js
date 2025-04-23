/**
 * Routes for managing the forum system (posts, replies, categories).
 * 
 * Handles:
 * - Creating, retrieving, updating, and deleting forum posts
 * - Adding and editing replies
 * - Fetching forum categories for filtering
 * 
 * Connected controller: ../controllers/postController.js
 */

const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostsByCategory,
  createForumPost,
  getPostsById,
  createReply,
  deletePostById,
  deleteAllPosts,
  getAllCategories,
  updateForumPost,
  updateReply,
} = require("../controllers/postController");

/**
 * @route GET /api/post
 * @desc Get all forum posts
 */
router.get('/', getAllPosts);

/**
 * @route GET /api/post/category/:category
 * @desc Get posts within a specific category
 */
router.get('/category/:category', getPostsByCategory);

/**
 * @route GET /api/post/id/:postId
 * @desc Get a single forum post by its UUID
 */
router.get('/id/:postId', getPostsById);

/**
 * @route POST /api/post
 * @desc Create a new forum post
 */
router.post('/', createForumPost);

/**
 * @route POST /api/post/:postId/reply
 * @desc Create a reply to a specific forum post
 */
router.post('/:postId/reply', createReply);

/**
 * @route DELETE /api/post/id/:id
 * @desc Delete a forum post by UUID
 */
router.delete('/id/:id', deletePostById);

/**
 * @route DELETE /api/post
 * @desc Delete all forum posts (used for admin/debug purposes)
 */
router.delete('/', deleteAllPosts);

/**
 * @route GET /api/post/categories
 * @desc Get a list of all unique post categories
 */
router.get('/categories', getAllCategories);

/**
 * @route PUT /api/post/id/:postId
 * @desc Update a forum post (typically used for edits or soft-deletes)
 */
router.put('/id/:postId', updateForumPost);

/**
 * @route PUT /api/post/id/:postId/:replyId
 * @desc Update a reply within a specific post
 */
router.put('/id/:postId/:replyId', updateReply);

module.exports = router;