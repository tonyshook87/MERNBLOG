import React, { useState } from "react";

const CommentForm = ({ onAddComment }) => {
  const [commentText, setCommentText] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return; // Prevent empty comments
    onAddComment(commentText); // Called from the props passed in at 
    setCommentText(""); // Clear the input field after submission
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write your comment here..."
        className="comment-input"
        rows="3"
        required
      ></textarea>
      <button type="submit" className="comment-submit">
        Post Comment
      </button>
    </form>
  );
};

export default CommentForm;
// In the CommentForm component, we have a form with a textarea input for the user to write a comment.
// The component uses the useState hook to manage the commentText state, which stores the text input from the user.
