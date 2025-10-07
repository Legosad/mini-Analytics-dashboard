import React from "react";

export default function CommentList({ comments, canDelete, onDelete }) {
  return (
    <ul>
      {comments.map((c) => (
        <li
          key={c._id}
          style={{ display: "flex", gap: 8, alignItems: "baseline" }}
        >
          <div>
            <b>{c.commenter}</b>: {c.text}
            <small> — {new Date(c.createdAt).toLocaleString()}</small>
          </div>
          {canDelete(c) && (
            <button onClick={() => onDelete(c._id)} style={{ marginLeft: 8 }}>
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
