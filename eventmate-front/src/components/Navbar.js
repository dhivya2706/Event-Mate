import React from "react";
import "../styles/Navbar.css";

export default function Navbar({ onLogin }) {
  return (
    <nav className="navbar">
      <div className="nav-left">EVENTMATE</div>
      <div className="nav-right">
        <button onClick={onLogin}>Login / Signup</button>
      </div>
    </nav>
  );
}