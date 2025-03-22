const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  displayName: { type: String },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String },
  emailVerified: { type: Boolean, default: false },
  providerId: { type: String }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
