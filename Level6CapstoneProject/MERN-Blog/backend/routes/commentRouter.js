const express = require("express");
const commentRouter = express.Router();
const Comment = require("../models/commentModel");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");

// create a new comment
commentRouter.post("/:blogId", async (req, res, next) => {
  try {
    const newComment = new Comment({
      ...req.body,
      author: req.auth._id,
      blog: req.params.blogId,
    });
    const savedComment = await newComment.save();
    const populatedComment = await Comment.findById(savedComment._id).populate(
      "author",
      "username"
    );
    res.status(201).send(populatedComment);
  } catch (error) {
    res.status(500).next(error);
  }
});

// get all comments for a specific blog post
commentRouter.get("/blog/:blogId", async (req, res, next) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId }).populate(
      "author",
      "username"
    );
    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a single comment by ID
commentRouter.get("/:commentId", async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate(
      "author",
      "username"
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    return res.status(200).send(comment);
  } catch (error) {
    res.status(500).send({ error: error.message });
    next(error);
  }
});

// Update a comment
commentRouter.put("/:commentId", async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.auth._id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this comment" });
    }

    comment.text = req.body.text; // Update text
    const updatedComment = await comment.save();
    res.status(200).send(updatedComment);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Delete a comment
commentRouter.delete("/:commentId", async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Authorization check (optional)
    if (comment.author.toString() !== req.auth._id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    // Remove the reference from the associated blog
    await Blog.findByIdAndUpdate(comment.blog, {
      $pull: { comments: comment._id },
    });

    // Use deleteOne() to delete the comment
    await Comment.deleteOne({ _id: comment._id });

    res.status(200).send(`Comment deleted successfully.`);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = commentRouter;
