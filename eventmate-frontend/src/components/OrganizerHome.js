import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function OrganizerHome() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Organizer Panel</h1>

      <div className="summary-container">
        <div 
          className="summary-card2"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/booking-monitoring")}
        >
          <h3>Booking Monitoring</h3>
        </div>
      </div>
    </div>
  );
}

export default OrganizerHome;
