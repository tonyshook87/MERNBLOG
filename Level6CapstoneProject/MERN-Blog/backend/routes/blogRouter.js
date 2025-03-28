const express = require("express");
const blogRouter = express.Router();
const Blog = require("../backend/models/blogModel");
const User = require("../backend/models/userModel");
const Comment = require("../backend/models/commentModel");

// Get all blog posts
blogRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({})
      .populate("author", "username") // Populate 'author' with 'username'
      .exec();

    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send({ error: error.message });
    next(error);
  }
});

blogRouter.get("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username") // Populate blog's author
      .populate({
        path: "comments", // Populate each comment
        populate: { path: "author", select: "username" }, // Populate the author of each comment
      });

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    res.status(200).send(blog);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get blog by title
blogRouter.get("/search/title/:title", async (req, res, next) => {
  try {
    const blogs = await Blog.find({ title: new RegExp(req.params.title, "i") }); // "i" means case-insensitive
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send({ error: error.message });
    next(error);
  }
});

// Search for blogs by author
blogRouter.get("/search/author/:author", async (req, res, next) => {
  try {
    const author = await User.findOne({
      username: req.params.author.toLowerCase(),
    });
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    const blogs = await Blog.find({ author: author._id });
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send({ error: error.message });
    next(error);
  }
});

// Create a blog post
blogRouter.post("/", async (req, res, next) => {
  try {
    const { title, content, image } = req.body;

    const newBlog = new Blog({
      title,
      content,
      image,
      author: req.auth._id, // Use the logged-in user's ID as the author
    });

    const savedBlog = await newBlog.save();
    res.status(201).send(savedBlog);
  } catch (error) {
    res.status(500);
    next(error);
  }
});

// Delete a blog post
blogRouter.delete("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      author: req.auth._id,
    });
    if (!blog) {
      res.status(403);
      return next(new Error("Unauthorized to delete this blog."));
    }
    res.status(200).send(`Blog ${req.params.id} deleted successfully.`);
  } catch (error) {
    res.status(500);
    next(error);
  }
});

// Update a blog post
blogRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.auth._id },
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedBlog) {
      res.status(403);
      return next(new Error("Unauthorized to edit this blog."));
    }
    res.status(200).send(updatedBlog);
  } catch (error) {
    res.status(500);
    next(error);
  }
});

blogRouter.put("/favorites/:id", async (req, res, next) => {
  try {
    const userId = req.auth._id;
    const blogId = req.params.id;

    // Find the blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if the user has already favorited the blog
    const isFavoriteInBlog = blog.favorites.includes(userId);
    const isFavoriteInUser = user.favorites.includes(blogId);

    if (isFavoriteInBlog && isFavoriteInUser) {
      // If already favorited, remove from both collections
      blog.favorites = blog.favorites.filter((id) => id.toString() !== userId);
      user.favorites = user.favorites.filter((id) => id.toString() !== blogId);
    } else {
      // Add to both collections
      blog.favorites.push(userId);
      user.favorites.push(blogId);
    }

    // Save the updated documents
    await blog.save();
    await user.save();

    res.status(200).send({
      userFavorites: user.favorites, // Updated favorites in User collection
      blogFavorites: blog.favorites, // Updated favorites in Blog collection
    });
  } catch (error) {
    console.error("Error updating favorites:", error);
    res.status(500).send({ error: error.message });
  }
});

blogRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate({
      path: "comments",
      populate: { path: "author", select: "username" },
    });
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.status(200).send(blog.comments);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

blogRouter.post("/:id/comments", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    // Create a new comment in the Comments collection
    const newComment = new Comment({
      text: req.body.text,
      author: req.auth._id, // Logged-in user is the author
      blog: req.params.id, // Associate the comment with the blog
      createdAt: new Date(),
    });
    const savedComment = await newComment.save(); // Save the new comment

    // Add the reference of the comment (commentId) to the blog's comments array
    blog.comments.push(savedComment._id);
    await blog.save();

    // Populate the comment's author (username) before returning
    const populatedComment = await Comment.findById(savedComment._id).populate(
      "author",
      "username"
    );

    res.status(201).send(populatedComment);
  } catch (error) {
    res.status(500).send({ error: error.message });
    next(error);
  }
});

module.exports = blogRouter;
