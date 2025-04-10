const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { expressjwt } = require("express-jwt");
const morgan = require("morgan");
const app = express();
const path = require("path");

app.use(express.json());
app.use(morgan("dev"));

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  bufferCommands: false
    });

    console.log("database connected successfully");
  } catch (error) {
    console.error(error);
  }
};
connectDB();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
// Middleware

// Routes
app.use("/api/auth", require("./routes/authRouter"));
app.use(
  "/api/blog",
  expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  require("./routes/blogRouter")
);
app.use(
  "/api/comments",
  expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  require("./routes/commentRouter")
);

// error handling
app.use((err, req, res, next) => {
  console.log(err);
  return res.send({ errMsg: err.message });
});

// Listen
const startServer = async () => {
  try {
  await connectDB(); // Ensure DB is connected first
 
  app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  });
  } catch (error) {
  console.error("❌ Server failed to start due to DB error:", error);
  }
 };
 
 startServer();
