import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
};

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const user  = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;
      const res   = await axios.get(`http://localhost:8080/api/events/organizer?email=${email}`);
      setEvents(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const getStatus = (date) => new Date(date) > new Date() ? "Upcoming" : "Completed";

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/events/${id}`);
      fetchEvents();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="org-page-title" style={{ marginBottom: 24 }}>
        <h2>Manage Events</h2>
        <p className="org-page-sub">Edit or remove your events</p>
      </div>

      {events.length === 0 ? (
        <div className="org-empty">
          <div className="org-empty-icon">🎟</div>
          <h3>No events yet</h3>
          <p>Add your first event to get started</p>
        </div>
      ) : (
        <div className="me-grid">
          {events.map(ev => {
            const status = getStatus(ev.eventDate);
            return (
              <div key={ev.id} className="me-card">
                {/* Image */}
                <div className="me-img-wrap">
                  <img src={`http://localhost:8080/uploads/${ev.imageName}`}
                    alt={ev.eventName} className="me-img"
                    onError={e => { e.target.style.display="none"; }} />
                  <div className="me-img-overlay" />
                  <span className={`me-status ${status}`}>{status}</span>
                </div>

                {/* Body */}
                <div className="me-body">
                  <h3 className="me-title">{ev.eventName}</h3>
                  <div className="me-meta">
                    <span className="me-meta-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {ev.venue}
                    </span>
                    <span className="me-meta-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {formatDate(ev.eventDate)}
                    </span>
                  </div>

                  {/* Tier pills */}
                  <div className="me-tiers">
                    {ev.vipSeats > 0 && <span className="me-tier vip">VIP ₹{ev.vipPrice}</span>}
                    {ev.premiumSeats > 0 && <span className="me-tier premium">Premium ₹{ev.premiumPrice}</span>}
                    {ev.regularSeats > 0 && <span className="me-tier regular">Regular ₹{ev.regularPrice}</span>}
                  </div>

                  {/* Actions */}
                  <div className="me-actions">
                    <button className="me-edit-btn" onClick={() => navigate(`edit/${ev.id}`)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                      Edit Event
                    </button>
                    <button className="me-delete-btn" onClick={() => deleteEvent(ev.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ManageEvents;
