import React, { createContext, useState } from "react";
import { userAxios } from "../context/UserContext"; 



export const BlogContext = createContext();

export default function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const response = await userAxios.get("/api/blog"); // Use userAxios for authenticated requests
      setBlogs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  const addBlog = async (blogData) => {
    try {
      const response = await userAxios.post("/api/blog", blogData);
      const newBlog = response.data;

      // Immediately add the new blog to the state
      setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  const editBlog = async (id, updatedBlog) => {
    try {
      const response = await userAxios.put(`/api/blog/${id}`, updatedBlog);
      setBlogs(
        (prevBlogs) =>
          prevBlogs.map((blog) => (blog._id === id ? response.data : blog)) // Update the specific blog in the state
      );
    } catch (error) {
      console.error("Error editing blog:", error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await userAxios.delete(`/api/blog/${id}`); // Make DELETE request to backend
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id)); // Remove blog locally
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const fetchComments = async (blogId) => {
    try {
      const response = await userAxios.get(`/api/blog/${blogId}/comments`);
      return response.data; 
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  };

  const addComment = async (blogId, commentData) => {
    try {
      const response = await userAxios.post(
        `/api/blog/${blogId}/comments`,
        commentData
      );
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId
            ? { ...blog, comments: [...blog.comments, response.data] }
            : blog
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (blogId, commentId) => {
    try {
      console.log("Deleting commentId:", commentId);
      await userAxios.delete(`/api/comments/${commentId}`);
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId
            ? {
                ...blog,
                comments: blog.comments.filter(
                  (comment) => comment._id !== commentId
                ),
              }
            : blog
        )
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const editComment = async (blogId, commentId, updatedText) => {
    try {
      const response = await userAxios.put(`/api/comments/${commentId}`, {
        text: updatedText,
      });
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId
            ? {
                ...blog,
                comments: blog.comments.map((comment) =>
                  comment._id === commentId ? response.data : comment
                ),
              }
            : blog
        )
      );
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  // async function updateFavorites(blogId) {
  //   try {
  //     const res = await userAxios.put(`/api/blog/favorites/${blogId}`);
  //     setBlogs((prevBlogs) =>
  //       prevBlogs.map((blog) => (blog._id === blogId ? res.data : blog))
  //     );
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  return (
    <BlogContext.Provider
      value={{
        blogs,
        comments,
        fetchBlogs,
        addBlog,
        editBlog,
        deleteBlog,
        addComment,
        deleteComment,
        editComment,
        fetchComments,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}
