import React, { useContext, useEffect, useState } from "react";
import { BlogContext } from "../context/BlogContext";
import { UserContext } from "../context/UserContext";
import CommentForm from "./CommentForm";

const CommentList = ({ blogId, fetchComments, addComment }) => {
  const { deleteComment, editComment } = useContext(BlogContext);
  const { user } = useContext(UserContext); // Access logged-in user
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await fetchComments(blogId);
      setComments(fetchedComments);
    };

    loadComments();
  }, [blogId, fetchComments]);

  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditedText(comment.text);
  };

  const submitEdit = async (commentId) => {
    await editComment(blogId, commentId, editedText);
    setEditingCommentId(null);
    setEditedText("");

    // Reload comments
    const updatedComments = await fetchComments(blogId);
    setComments(updatedComments);
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment._id} className="comment-item">
            <p>{comment.text}</p>
            <small>By: {comment.author?.username || "Anonymous"}</small>

            {/* Render Edit/Delete buttons only for the comment's author */}
            {comment.author?._id === user?._id && (
              <div>
                <button onClick={() => deleteComment(blogId, comment._id)}>
                  Delete
                </button>
                <button onClick={() => startEditing(comment)}>Edit</button>
              </div>
            )}

            {editingCommentId === comment._id && (
              <div>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={() => submitEdit(comment._id)}>Save</button>
                <button onClick={() => setEditingCommentId(null)}>
                  Cancel
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <CommentForm onAddComment={(text) => addComment(blogId, { text })} />
    </div>
  );
};

export default CommentList;
