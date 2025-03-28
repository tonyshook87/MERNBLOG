const express = require("express");
const authRouter = express.Router();
const User = require("../backend/models/userModel");
const jwt = require("jsonwebtoken");

// The pre("save") middleware hashes the user's password before saving it in the database. T
// his ensures that passwords are never stored in plain text.
// After the user is saved, the withoutPassword method is used to remove the password field from the returned user object before generating the JWT.

authRouter.post("/signup", async (req, res, next) => {
  try {
    // Validate input
    const { username, email, password } = req.body;
    if (!req.body.email || !req.body.password) {
      res.status(400);
      return next(new Error("Email and password are required."));
    }

    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUser) {
      res.status(403);
      return next(new Error("User already exists"));
    }

    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
    });
    const savedUser = await newUser.save();
    const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET);
    res.status(201).send({ token, user: savedUser.withoutPassword() });
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

//The checkPassword method compares the provided password with the hashed password stored in the database.
// If the password matches, the withoutPassword method is again used to remove sensitive information before sending the JWT and user data back to the client.

authRouter.post("/login", async (req, res, next) => {
  try {
    // Validate input
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      return next(new Error("Email and password are required."));
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(403);
      return next(new Error("Email or password is incorrect."));
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      res.status(403);
      return next(new Error("Email or password is incorrect."));
    }

    const token = jwt.sign(user.withoutPassword(), process.env.SECRET, {
      expiresIn: "1h",
    });

    res.status(201).send({ token, user: user.withoutPassword() });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500);
    return next(error);
  }
});

module.exports = authRouter;
