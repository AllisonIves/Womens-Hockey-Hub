const fs = require('fs');
const Post = require('../models/post');
const bannedWords_path = 'bannedWords.json';

const bannedWordsList = JSON.parse(fs.readFileSync(bannedWords_path)).bannedWordsList;
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
exports.getPostsById = async (req, res) => {
    try {
        //Extract category from req parameters
        const { postId } = req.params;

        //Query the db
        const post = await Post.findOne({ id: postId });

        //No posts found handling
        if (!post) {
          return res.status(404).json({ message: "No post found with this ID." });
        }

        //Send the posts as a response
        res.json(post);
    } catch (err) {
        //Handle any potential errors
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

//UPDATE forum post



exports.updateForumPost = [
  //Validation (just type for now)
    body('contents').optional().isString().withMessage('Contents must be a string'),
    body('isEdited').optional().isBoolean().withMessage('isEdited must be a boolean'),

    async (req, res) => {
        
    //Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { contents} = req.body;

        try {
            //Find the post by id
            const { postId } = req.params;
            const post = await Post.findOne({ id: postId});
            if (!post) {
                return res.status(404).json({ error: 'Post not found' }); //Not found handling
            }


            //Update fields (if provided)
            if (contents !== undefined) {
                post.contents = contents;
                post.isEdited = true; //Set isEdited boolean to true if content is updated
            }


            //Save updated post
            const updatedPost = await post.save();

            res.status(200).json(updatedPost);

        } catch (error) {
            console.error("Error updating:", error);
            res.status(500).json({ error: 'Failed to update' });
    }
  }
];


//Reply CRUD
//POST /api/post/:postId/reply
exports.createReply = [
    //Validation for the reply content
    body('contents').isString().notEmpty().withMessage('Reply cannot be empty'),
  
    async (req, res) => {
      //Check validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const { userName, contents, isEdited} = req.body; //Extract body
        const { postId } = req.params; //Extract postId from the request parameters

        //Find the post by string id
        const post = await Post.findOne({ id: postId });
  
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
  
        //Create the reply object
        const newReply = {
          userName,
          contents,
          isEdited: false,//dEfault false
        };
  
        //Add new reply to replies array
        post.replies.push(newReply);
  
        //Save post with new reply
        const updatedPost = await post.save();
  
        //Respond with the updated post
        res.status(201).json(updatedPost);
      } catch (error) {
        console.error("Error creating reply:", error);
        res.status(500).json({ error: "Failed to create reply" });
      }
    },
  ];

exports.updateReply = [
    // Validation for the reply content
    body('contents').optional().isString().withMessage('Reply content must be a string'),
  
    async (req, res) => {
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
  
        const { contents } = req.body; //Extract the contents from the request body
        const { postId, replyId } = req.params; //Extract postId and replyId from the request params
  
        try {
            //Find the post by postId
            const post = await Post.findOne({ id: postId });
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
  
            //Find the reply by replyId within the post's replies
            const reply = post.replies.id(replyId); //Set reply as the reply with provided replyId from replies array
            if (!reply) {
            return res.status(404).json({ message: "Reply not found" });
            }
  
            //Update the contents (if provided)
            if (contents !== undefined) {
            reply.contents = contents;
            reply.isEdited = true; //Set isEdited to true when the reply is updated
            }
  
            //Save updated post
            const updatedPost = await post.save();
  
            //Respond with the updated post
            res.status(200).json(updatedPost);
        } catch (error) {
            console.error("Error updating reply:", error);
            res.status(500).json({ error: "Failed to update reply" });
        }
    }
  ];


exports.deletePostById = async(req, res) => {
  try {
    const {thisId} = req.params;
    const post = await Post.findOne({thisId});
    const {contents} = req.body;
    
    if (!post)
    {
        return res.status(400).json({message: "Post not found"});
    }

    post.contents = "This post has been deleted";
    const deletedPost = await post.save();

    res.status(200).json(deletedPost);
  }catch(error)
  {
    res.status(500).json({message: "Error"});
  }
}

// DELETE ALL /api/forum
exports.deleteAllPosts = async (req, res) => {
  try {
    const result = await Post.deleteMany({});
    res.status(200).json({ message: `Deleted ${result.deletedCount} post(s).` });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete posts.", error: err.message });
  }
};

// GET /api/forum/categories
exports.getAllCategories = async (req, res) => {
  try {
    const posts = await Post.find().select("Category -_id");
    const categories = [...new Set(posts.map(post => post.Category))];
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
