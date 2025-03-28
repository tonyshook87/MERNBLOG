import React, { useState } from "react";
import CommentList from "./CommentList"; 

const CollapsibleComments = ({
  blogId,
  comments,
  addComment,
  editComment,
  deleteComment,
  fetchComments,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleComments = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className="comments-container">
      <button onClick={toggleComments} className="toggle-button">
        {isOpen ? "Hide Comments" : "Show Comments"} ({comments.length})
      </button>
      {isOpen && (
        <div className="comments-content">
          <CommentList
            blogId={blogId}
            comments={comments}
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

export default CollapsibleComments;
