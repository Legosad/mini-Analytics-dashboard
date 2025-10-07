import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostsAPI } from "../api/posts";

export default function NewPost() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await PostsAPI.create({ title, content });
      nav("/");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="container">
      <h4>New Post</h4>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <form onSubmit={submit}>
        <input
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button>Create</button>
      </form>
    </div>
  );
}
