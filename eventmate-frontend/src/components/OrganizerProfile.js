import React, { useState, useEffect } from "react";
import axios from "axios";

function OrganizerProfile() {

  const email = localStorage.getItem("email");

  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [saving, setSaving] = useState(false);

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    if (!email) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/organizer/profile?email=${email}`
        );
        setOrganizer(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [email]);

  // ---------------- FETCH EVENTS ----------------
  useEffect(() => {
    if (!email) return;

    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/organizer/events?email=${email}`
        );
        setEvents(res.data);
      } catch (err) {
        console.error("Events fetch error:", err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [email]);

  // ---------------- UPDATE PROFILE ----------------
  const handleUpdate = async () => {
    if (!organizer) return;

    setSaving(true);
    try {
      await axios.put(
        "http://localhost:8080/api/organizer/profile",
        organizer
      );

      alert("Profile Updated Successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // ---------------- STATES ----------------
  if (!email)
    return <p style={{ padding: "20px" }}>No login session. Please login again.</p>;

  if (loadingProfile || loadingEvents)
    return <p style={{ padding: "20px" }}>Loading data...</p>;

  if (!organizer)
    return <p style={{ padding: "20px" }}>Organizer not found.</p>;

  // ---------------- UI ----------------
  return (
    <div style={{ padding: "20px" }}>
      <h2>Organizer Dashboard</h2>

      {/* PROFILE SECTION */}
      <section style={{ marginBottom: "30px" }}>
        <h3>Update Profile</h3>

        <input
          type="text"
          value={organizer.name || ""}
          onChange={(e) =>
            setOrganizer({ ...organizer, name: e.target.value })
          }
          placeholder="Name"
          style={inputStyle}
        />

        <input
          type="text"
          value={organizer.phone || ""}
          onChange={(e) =>
            setOrganizer({ ...organizer, phone: e.target.value })
          }
          placeholder="Phone"
          style={inputStyle}
        />

        <input
          type="text"
          value={organizer.companyName || ""}
          onChange={(e) =>
            setOrganizer({ ...organizer, companyName: e.target.value })
          }
          placeholder="Company Name"
          style={inputStyle}
        />

        <button onClick={handleUpdate} disabled={saving} style={btnStyle}>
          {saving ? "Updating..." : "Update Profile"}
        </button>
      </section>

      {/* EVENTS SECTION */}
      <section>
        <h3>My Events</h3>

        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <strong>{event.eventName}</strong> — ₹{event.ticketPrice} — Seats: {event.totalSeats}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// styles
const inputStyle = {
  display: "block",
  marginBottom: "10px",
  padding: "8px",
  width: "300px"
};

const btnStyle = {
  padding: "8px 16px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default OrganizerProfile;