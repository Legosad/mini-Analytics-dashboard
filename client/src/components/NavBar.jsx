import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav
      style={{
        display: "flex",
        gap: 12,
        alignItems: "baseline",
        padding: "12px 16px",
      }}
    >
      <h3 style={{ margin: 0 }}>Mini Analytics</h3>
      <Link to="/">Posts</Link>
      <Link to="/new">New</Link>
      <Link to="/insights">Insights</Link>
      <span style={{ marginLeft: "auto" }}>
        {user ? (
          <>
            <small>
              Signed in as <b>{user.username}</b>
            </small>{" "}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> |{" "}
            <Link to="/register">Register</Link>
          </>
        )}
      </span>
    </nav>
  );
}
