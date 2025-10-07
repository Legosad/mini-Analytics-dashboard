import React from "react";
export default function Loader({ text = "Loading…" }) {
  return <p style={{ opacity: 0.7 }}>{text}</p>;
}
