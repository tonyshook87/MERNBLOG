const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  image: { type: String },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // References to Comment
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Blog", blogSchema);

// comments:
// Stored as an array of objects, where each object represents a single comment.
// Each comment includes a reference to the user who wrote it and a timestamp.
