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

router.get('/', getAllPosts);
router.get('/category/:category', getPostsByCategory);
router.get('/id/:postId', getPostsById);
router.post('/', createForumPost);
router.post('/:postId/reply', createReply);
router.delete('/id/:id', deletePostById);
router.delete('/', deleteAllPosts);
router.get('/categories', getAllCategories);
router.put('/id/:postId', updateForumPost);
router.put('/id/:postId/:replyId', updateReply);

module.exports = router;