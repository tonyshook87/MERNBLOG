import React, { useState, useEffect } from "react";

const BlogForm = ({ blog = {}, onSubmit }) => {
  const [title, setTitle] = useState(blog.title || "");
  const [content, setContent] = useState(blog.content || "");
  const [image, setImage] = useState(blog.image || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ title, content, image }); // onSubmit is called from props passed in from the BlogPage as well as blog
    }

    setTitle("");
    setContent("");
    setImage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Image URL"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default BlogForm;
