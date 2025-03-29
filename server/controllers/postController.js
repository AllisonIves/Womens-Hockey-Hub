const Post = require('../models/post');

//REST API

//GET /api/post
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
};

//GET /api/post/category/:category
exports.getPostsByCategory = async (req, res) => {
    try {
        //Extract category from req parameters
        const { category } = req.params;

        //Query the db
        const posts = await Post.find({ Category: category });

        //No posts found handling
        if (!posts.length) {
            return res.status(404).json({ message: "No posts found for this category." });
        }

        //Send the posts as a response
        res.json(posts);
    } catch (err) {
        //Handle any potential errors
        res.status(500).json({ message: err.message });
    }
};

//CREATE forum post
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

exports.createForumPost = [
  //Validation
  //Expand contents validation to add min max characters -- should make util?
  body('contents').isString().notEmpty().withMessage('Contents are required'),
  body('Category').optional().isString(),
  body('isPinned').optional().isBoolean(),
  body('isEdited').optional().isBoolean(),
  body('replies').optional().isArray(),

  async (req, res) => {
    //Check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        //Generate id
        const id = uuidv4();
        //get display name from session storage
        //const userName = sessionStorage.getItem("displayName");
        //use req body to assign the other attributes
        const { userName, contents, Category, isEdited, isPinned, replies } = req.body;
      
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