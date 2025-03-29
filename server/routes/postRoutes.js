const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostsByCategory,
  createForumPost
} = require("../controllers/postController");

router.get('/', getAllPosts);
router.get('/:category', getPostsByCategory);
router.post('/', createForumPost);

module.exports = router;