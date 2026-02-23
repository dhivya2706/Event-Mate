import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;

      const res = await axios.get(
        `http://localhost:8080/api/events/organizer?email=${email}`
      );

      setEvents(res.data);
    } catch (err) {
      console.error("Fetch events error:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Manage Events</h2>

      <div className="event-card-container">
        {events.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          events.map((e) => (
            <div className="event-row" key={e.id}>
              
              {/* LEFT SIDE */}
              <div className="event-left">
                <div className="event-title">{e.eventName}</div>
                <div className="event-sub">
                  {e.eventDate || "Upcoming"} • {e.totalSeats} seats
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="event-actions">
                
                <span className="status-badge">
                  Upcoming
                </span>

                <button
                  className="action-btn edit-btn"
                  onClick={() => navigate(`edit/${e.id}`)}
                >
                  ✏
                </button>

                <button
                  className="action-btn delete-btn"
                  onClick={() => deleteEvent(e.id)}
                >
                  🗑
                </button>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageEvents;