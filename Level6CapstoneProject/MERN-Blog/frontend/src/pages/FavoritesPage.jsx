import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { BlogContext } from "../context/BlogContext";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const { user } = useContext(UserContext); // Get user data
  const { blogs } = useContext(BlogContext); // Access all blogs

  // Safely filter blogs that are in the user's favorites
  const favoriteBlogs = blogs.filter(
    (blog) => user?.favorites?.includes(blog._id) // Ensure user and favorites exist
  );

  return (
    <div className="favorites-page">
      <h1>Your Favorites</h1>
      {favoriteBlogs.length > 0 ? (
        <ul>
          {favoriteBlogs.map((blog) => (
            <li key={blog._id} className="favorite-item">
              <img
                src={blog.image || "https://via.placeholder.com/150"}
                alt={blog.title}
              />
              <div className="favorite-item-content">
                <h3>
                  <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                </h3>
                <p>{blog.content.substring(0, 100)}...</p>{" "}
                {/* Shortened content */}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven’t added any blogs to your favorites yet.</p>
      )}
    </div>
  );
};

export default FavoritesPage;
