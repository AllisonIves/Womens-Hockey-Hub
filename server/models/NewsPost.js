const mongoose = require('mongoose');

const newsPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  imageURL: { type: String },
  tags: [String],
  postedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const NewsPost = mongoose.model("NewsPost", newsPostSchema);

module.exports = NewsPost