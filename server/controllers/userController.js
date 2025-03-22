const User = require("../models/User");

const saveUser = async (req, res) => {
  const { uid, displayName, email, photoURL, emailVerified, providerId } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ message: "UID and email are required." });
  }

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({ uid, displayName, email, photoURL, emailVerified, providerId });
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
