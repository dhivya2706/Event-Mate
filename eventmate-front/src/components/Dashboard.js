import React from "react";
import "../styles/Dashboard.css";

export default function Dashboard({ user }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Welcome, {user.email}</h1>
        <p>Your role: {user.role}</p>
        <div className="profile-pic">👤</div>
      </div>
    </div>
  );
}
