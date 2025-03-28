import React, { useContext } from "react";
import { BlogContext } from "../context/BlogContext";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

const BlogList = () => {
  const { blogs } = useContext(BlogContext);
  const { user, updateFavorites } = useContext(UserContext);

  return (
    <div className="blog-list">
      {blogs.map((blog) => {
        const isFavorite = user?.favorites?.includes(blog._id); // Check if blog is favorited

        return (
          <div className="blog-card" key={blog._id}>
            <img
              src={blog.image || "null"}
              alt={blog.title}
              className="blog-image"
            />
            <div className="blog-content">
              <h3>{blog.title}</h3>
              <p>{blog.content.substring(0, 100)}...</p>
              <p className="blog-author">
                Posted By: {blog.author?.username || "Anonymous"}
              </p>
              {/* Add Favorite Button */}
              <button
                className={`favorite-button ${isFavorite ? "favorited" : ""}`}
                onClick={() => updateFavorites(blog._id)} // toggles the favorite button
              >
                {isFavorite ? "💖" : "🤍"}{" "}
                {/* Red heart if favorited, gray if not */}
              </button>
              <Link to={`/blog/${blog._id}`} className="read-more">
                Read More
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogList;
