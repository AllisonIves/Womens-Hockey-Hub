/**
 * @file Controller for saving or retrieving Firebase-authenticated users.
 * Used during Google Sign-In to sync user information with MongoDB.
 */

const User = require("../models/User");

/**
 * Save a new user or return existing user if already saved.
 * This is used after Firebase login to store user info in MongoDB.
 *
 * @route POST /api/users
 * @bodyParam {string} uid - Firebase UID (required)
 * @bodyParam {string} email - User's email (required)
 * @bodyParam {string} displayName - Firebase display name
 * @bodyParam {string} photoURL - Profile image URL
 * @bodyParam {boolean} emailVerified - Whether the user verified their email
 * @bodyParam {string} providerId - The Firebase provider (e.g., google.com)
 * @bodyParam {boolean} isAdmin - Whether user is an Admin role
 */
const saveUser = async (req, res) => {
  const { uid, displayName, email, photoURL, emailVerified, providerId, isAdmin } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ message: "UID and email are required." });
  }

  try {
    let user = await User.findOne({ uid });s

    if (!user) {
      user = new User({ uid, displayName, email, photoURL, emailVerified, providerId, isAdmin });
      await user.save();
      return res.status(201).json({ message: "User created", user });
    } else {
      return res.status(200).json({ message: "User already exists", user });
    }
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = { saveUser };
