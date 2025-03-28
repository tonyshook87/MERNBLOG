import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BlogContext } from "../context/BlogContext";
import { UserContext } from "../context/UserContext";
import BlogForm from "../components/BlogForm";
import CollapsibleComments from "../components/CollapsibleComments";

const BlogPage = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const navigate = useNavigate();
  const {
    blogs,
    deleteBlog,
    editBlog,
    fetchBlogs,
    addComment,
    editComment,
    deleteComment,
    fetchComments,
  } = useContext(BlogContext);
  const { user } = useContext(UserContext); // Get logged-in user's info

  const [blog, setBlog] = useState(null); // Manage local blog state
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit modes

  useEffect(() => {
    // Fetch the blog dynamically if it's not already available in context
    const fetchBlogData = async () => {
      if (blogs.length === 0) {
        await fetchBlogs(); // Fetch blogs if none are in context
      }
      const selectedBlog = blogs.find((b) => b._id === id);
      if (selectedBlog) {
        setBlog(selectedBlog); // Set the blog to local state
      } else {
        console.error("Blog not found");
      }
    };

    fetchBlogData();
  }, [id, blogs, fetchBlogs]);

  const handleDelete = async () => {
    try {
      await deleteBlog(blog._id);
      navigate("/"); // Redirect to homepage after deletion
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleEdit = async (updatedBlog) => {
    try {
      await editBlog(blog._id, updatedBlog);
      setIsEditing(false); // Exit edit mode after successful edit
    } catch (error) {
      console.error("Error editing blog:", error);
    }
  };

  if (!blog) return <p>Loading...</p>;

  const isOwner = user?._id === blog.author?._id; // Check if logged-in user owns the blog

  return (
    <div className="blog-page">
      {isEditing ? (
        <BlogForm blog={blog} onSubmit={handleEdit} />
      ) : (
        <div>
          <h1>{blog.title}</h1>
          <img src={blog.image} alt={blog.title} className="blog-image" />
          <p>{blog.content}</p>
          <p>Posted By: {blog.author?.username || "Anonymous"}</p>

          {isOwner && (
            <div className="blog-actions">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}

          
          <CollapsibleComments
            blogId={blog._id}
            comments={blog.comments}
            addComment={addComment}
            editComment={editComment}
            deleteComment={deleteComment}
            fetchComments={fetchComments}
          />
        </div>
      )}
    </div>
  );
};

export default BlogPage;
