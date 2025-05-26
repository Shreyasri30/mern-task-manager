import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", backgroundColor: "#222", color: "white" }}>
      <Link to="/" style={linkStyle}>🏠 Home</Link>
      <Link to="/register" style={linkStyle}>📝 Register</Link>
      <Link to="/login" style={linkStyle}>🔐 Login</Link>
      <Link to="/dashboard" style={linkStyle}>📋 Dashboard</Link>
    </nav>
  );
}

const linkStyle = {
  marginRight: "20px",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold"
};
