import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PostsAPI } from "../api/posts";
import { CommentsAPI } from "../api/comments";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      const [p, c] = await Promise.all([
        PostsAPI.get(id),
        CommentsAPI.listByPost(id),
      ]);
      setPost(p.data);
      setComments(c);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const addComment = async (text) => {
    try {
      await CommentsAPI.create(id, { text });
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const delComment = async (cid) => {
    try {
      await CommentsAPI.remove(cid);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const deletePost = async () => {
    try {
      await PostsAPI.remove(id);
      window.history.back();
    } catch (e) {
      setErr(e.message);
    }
  };

  const canDeletePost = useMemo(
    () => user && post && user.username === post.author,
    [user, post]
  );
  const canDeleteComment = (c) =>
    user && (user.username === c.commenter || user.username === post?.author);

  if (!post)
    return (
      <div className="container">{err ? <p>{err}</p> : <p>Loading…</p>}</div>
    );

  return (
    <div className="container">
      <h3>{post.title}</h3>
      <p>
        <i>by {post.author}</i>
      </p>
      <p>{post.content}</p>
      {canDeletePost && <button onClick={deletePost}>Delete Post</button>}
      <hr />
      <h5>Comments</h5>
      <CommentList
        comments={comments}
        canDelete={canDeleteComment}
        onDelete={delComment}
      />
      {user ? (
        <CommentForm onSubmit={addComment} />
      ) : (
        <p>
          <i>Login to comment</i>
        </p>
      )}
      {err && <p style={{ color: "crimson" }}>{err}</p>}
    </div>
  );
}
