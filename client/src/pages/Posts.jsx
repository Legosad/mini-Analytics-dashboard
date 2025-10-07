import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostsAPI } from "../api/posts";
import PostCard from "../components/PostCard";

export default function Posts() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  const fetchData = async () => {
    try {
      const res = await PostsAPI.list(
        q ? `search=${encodeURIComponent(q)}` : ""
      );
      setList(res.data);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button onClick={fetchData}>Search</button>
        <span style={{ marginLeft: "auto" }}>
          <Link to="/new">+ New Post</Link>
        </span>
      </div>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <ul>
        {list.map((p) => (
          <PostCard key={p._id} post={p} />
        ))}
      </ul>
    </div>
  );
}
