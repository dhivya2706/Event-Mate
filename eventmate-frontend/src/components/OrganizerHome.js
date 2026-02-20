import React from "react";
import Layout from "./Layout";
import "../styles/Dashboard.css";

function OrganizerHome() {
  return (
    <Layout>
      <div className="welcome-card">
        <h1>Welcome Back 👋</h1>
        <p>Manage your events and bookings easily from here.</p>
      </div>
    </Layout>
  );
}

export default OrganizerHome;