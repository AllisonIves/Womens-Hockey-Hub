/**
 * @file Defines the Mongoose schema for news articles displayed on the homepage.
 * This model is used to create, retrieve, update, and delete news content.
 */

const mongoose = require('mongoose');

/**
 * Schema for news articles shown on the Women's Hockey Hub landing page.
 */
const newsPostSchema = new mongoose.Schema({
  /** Title of the news article */
  title: { type: String, required: true },

  /** Full content/body of the article */
  content: { type: String, required: true },

  /** Author name (defaults to "Anonymous" if not provided) */
  author: { type: String, default: "Anonymous" },

   /** Image URL to accompany the article (optional) */
  imageURL: { type: String },

  /** Optional list of tags or keywords for filtering */
  tags: [String],

  /** Timestamp when the post was first created */
  postedAt: { type: Date, default: Date.now },

  /** Timestamp when the post was last updated */
  updatedAt: { type: Date, default: Date.now }
});

const NewsPost = mongoose.model("NewsPost", newsPostSchema);

module.exports = NewsPost