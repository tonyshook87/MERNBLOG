const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }], // List of favorited blog IDs
});

// pre('save') is a Mongoose middleware that runs before a document is saved,
// hashing the user's password before saving it to the db. ensuring passwords are never stored in plain text
// This is done to protect user data and prevent unauthorized access.

// if the password hasn't been modified, there's no need to hash it again.
// This is useful when you only want to update certain fields, not the entire document.
userSchema.pre("save", async function (next) {
  this.email = this.email.toLowerCase();
  this.username = this.username.toLowerCase();
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// this method compares the provided password against the hashed password in the db
// if the passwords match, it returns true, otherwise it returns false.

// this.password is the hashed password stored in the db
// passwordAttempt is the password provided by the user for authentication

userSchema.methods.checkPassword = async function (passwordAttempt) {
  return await bcrypt.compare(passwordAttempt, this.password);
};

// Safeguards sensitive user data by removing the password from objects sent to the client.
userSchema.methods.withoutPassword = function () {
  const user = this.toObject(); // if the password matches, this method is used to remove sensitive info before sending the JWT and user data back to the client
  return user;
};

module.exports = mongoose.model("User", userSchema);
