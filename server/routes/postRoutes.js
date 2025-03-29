const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostsByCategory,
  createForumPost,
  getPostsById,
  createReply
} = require("../controllers/postController");

router.get('/', getAllPosts);
router.get('/category/:category', getPostsByCategory);
router.get('/id/:id', getPostsById);
router.post('/', createForumPost);
router.post('/:postId/reply', createReply);

module.exports = router;