import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { BlogContext } from "../context/BlogContext";
import { Link } from "react-router-dom";
import BlogForm from "../components/BlogForm";

const ProfilePage = () => {
  const { user } = useContext(UserContext);
  const { blogs, addBlog } = useContext(BlogContext);

  // Filter blogs authored by the current user
  const userBlogs = blogs.filter((blog) => blog.author?._id === user?._id);

  // Filter blogs that are in the user's favorites
  const favoriteBlogs = blogs.filter((blog) =>
    user?.favorites?.includes(blog._id)
  );

  return (
    <div className="profile-page">
      <h1>Welcome, {user?.username || "Guest"}!</h1>
   
      <h2>Create a New Blog</h2>
      <BlogForm onSubmit={addBlog} />{" "} 
     
    
      <h2>Your Blogs</h2>
      {userBlogs.length > 0 ? (
        <ul>
          {userBlogs.map((blog) => (
            <li key={blog._id}>
              <Link to={`/blog/${blog._id}`}>
                <h3>{blog.title}</h3>
              </Link>
              <p>{blog.content.substring(0, 100)}...</p>{" "}
           
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven’t written any blogs yet.</p>
      )}
    
      <h2>Your Favorites</h2>
      {favoriteBlogs.length > 0 ? (
        <ul>
          {favoriteBlogs.map((blog) => (
            <li key={blog._id}>
              <Link to={`/blog/${blog._id}`}>
                <h3>{blog.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven’t added any blogs to your favorites yet.</p>
      )}
    </div>
  );
};

export default ProfilePage;
