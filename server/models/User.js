/**
 * @file Defines the Mongoose schema for Firebase-authenticated users.
 * This model is used to store user profiles retrieved after Google Sign-In.
 */

const mongoose = require("mongoose");

/**
 * Schema for authenticated Firebase users stored in MongoDB.
 * Created when a user logs in via Google Sign-In.
 */
const userSchema = new mongoose.Schema({
  /** Firebase UID (unique identifier for the user) */
  uid: { type: String, required: true, unique: true },
  
  /** Display name from Firebase profile (optional) */
  displayName: { type: String },
  
  /** User's email address (must be unique) */
  email: { type: String, required: true, unique: true },
  
  /** URL to the user's profile photo (optional) */
  photoURL: { type: String },
  
  /** Whether the user's email has been verified through Firebase */
  emailVerified: { type: Boolean, default: false },
  
  /** The provider used to authenticate the user (will always be google) */
  providerId: { type: String },

  /** Whether user is Admin role */
  isAdmin: {type: Boolean, default: false}
}, 
/** Automatically add createdAt and updatedAt timestamps */
{ timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
