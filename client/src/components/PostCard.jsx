import React from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <li>
      <Link to={`/post/${post._id}`}>{post.title}</Link>
      <small>
        {" "}
        — by {post.author} • comments: {post.commentCount ?? 0}
      </small>
    </li>
  );
}
