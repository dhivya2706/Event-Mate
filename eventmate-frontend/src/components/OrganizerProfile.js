import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

function OrganizerProfile() {

  const { organizer, setOrganizer } = useOutletContext();

  const [events, setEvents] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {

    if (!organizer?.email) return;

    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/organizer/events?email=${organizer.email}`
        );
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();

  }, [organizer.email]);

  const handleUpdate = async () => {

    setSaving(true);

    try {
      const res = await axios.put(
        "http://localhost:8080/api/organizer/profile",
        organizer
      );

      setOrganizer(res.data);  
      alert("Profile Updated!");

    } catch {
      alert("Update Failed");
    }

    setSaving(false);
  };

  return (
    <div className="profile-grid">

      <div className="profile-card">
        <h3>Update Profile</h3>

        <input
          className="profile-input"
          value={organizer.name}
          onChange={(e) =>
            setOrganizer({ ...organizer, name: e.target.value })
          }
        />

        <input
          className="profile-input"
          value={organizer.phone}
          onChange={(e) =>
            setOrganizer({ ...organizer, phone: e.target.value })
          }
        />

        <input
          className="profile-input"
          value={organizer.companyName}
          onChange={(e) =>
            setOrganizer({ ...organizer, companyName: e.target.value })
          }
        />

        <div className="button-center">
          <button className="modal-btn" onClick={handleUpdate}>
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>

      <div className="profile-card">
        <h3>My Events</h3>

        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          <ul className="profile-events">
            {events.map((event) => (
              <li key={event.id}>
                <span>{event.eventName}</span>
                <span>₹{event.ticketPrice}</span>
                <span>{event.totalSeats} seats</span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

export default OrganizerProfile;