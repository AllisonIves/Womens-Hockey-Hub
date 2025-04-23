/**
 * Routes for managing authenticated users from Firebase.
 * 
 * Handles:
 * - Creating or updating user records after login
 * - Logging out users (sets emailVerified to false)
 * - Fetching all users or individual user profiles
 * - Deleting users (for testing/debugging purposes)
 * 
 * Connected model: ../models/User.js
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @route POST /api/users
 * @desc Create or update a user record based on Firebase UID
 */
router.post('/', async (req, res) => {
  try {
    const { uid, displayName, email, photoURL, emailVerified, providerId } = req.body;

    let user = await User.findOne({ uid });

    if (user) {
      user.displayName = displayName;
      user.email = email;
      user.photoURL = photoURL;
      user.emailVerified = emailVerified;
      user.providerId = providerId;
      await user.save();
      return res.status(200).json({ message: 'User updated', user });
    }

    user = new User({ uid, displayName, email, photoURL, emailVerified, providerId });
    await user.save();
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route GET /api/users
 * @desc Get all registered users (sorted by creation date descending)
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * @route POST /api/users/logout
 * @desc Log out a user by setting emailVerified to false
 */
router.post("/logout", async (req, res) => {
    try {
      const { uid } = req.body;
  
      if (!uid) {
        return res.status(400).json({ message: "UID is required" });
      }
  
      const user = await User.findOneAndUpdate(
        { uid },
        { emailVerified: false },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User logged out", user });
    } catch (error) {
      console.error("Logout route error:", error);
      res.status(500).json({ message: "Server error during logout" });
    }
  });

    /**
   * @route GET /api/users/:userName
   * @desc Get a user's profile by displayName
   */
  router.get("/:userName", async (req, res) => {
    try {
      const { userName } = req.params;
      
      //Query the db and find a user by displayName
      const user = await User.findOne({ displayName: userName });
  
      //If no user is found, return a 404 error
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      //Return the user object
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

    /**
   * @route DELETE /api/users/:displayName
   * @desc Delete a user by displayName (for testing/debugging only)
   */
  router.delete("/:displayName",  async (req, res) => {
  try {
    const { displayName } = req.params;
    const deletedUser = await User.findOneAndDelete({ displayName });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user.", error: err.message });
  }
});

module.exports = router;