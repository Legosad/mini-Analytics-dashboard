import React, { useState } from "react";

export default function CommentForm({ onSubmit }) {
  const [text, setText] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await onSubmit(text.trim());
    setText("");
  };
  return (
    <form onSubmit={submit} style={{ marginTop: 12 }}>
      <input
        placeholder="write a comment…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}
