import React, { useState, useEffect } from "react";
import "../styles/UserDashboard.css";
import Booking from "./Booking";

function UserDashboard({ currentUser }) {
  const [selectedEventData, setSelectedEventData] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [events, setEvents] = useState([]);

  const loggedUser = currentUser || JSON.parse(localStorage.getItem("user"));

  const username =
    loggedUser?.name ||
    localStorage.getItem("adminName") ||
    loggedUser?.email?.split("@")[0] ||
    "User";

  const [profile, setProfile] = useState({
    name: loggedUser?.name || "",
    email: loggedUser?.email || localStorage.getItem("adminEmail") || "",
    phone: loggedUser?.phone || "",
  });

  // ================= FETCH EVENTS =================
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/events");
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  // ================= AUTO SLIDER =================
  useEffect(() => {
    if (!events.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [events]);

  // ================= DATE FILTER =================
  useEffect(() => {
    if (!selectedDate) {
      setFilteredEvents([]);
      return;
    }
    const filtered = events.filter((event) => {
      if (!event?.event_date) return false;
      const backendDate = new Date(event.event_date);
      const selected = new Date(selectedDate);
      return (
        backendDate.getFullYear() === selected.getFullYear() &&
        backendDate.getMonth() === selected.getMonth() &&
        backendDate.getDate() === selected.getDate()
      );
    });
    setFilteredEvents(filtered);
  }, [selectedDate, events]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // ================= PROFILE SAVE =================
  const handleProfileSave = () => {
    const updatedUser = { ...loggedUser, name: profile.name, phone: profile.phone };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("adminName", profile.name);
    setShowProfile(false);
  };

  // ✅ FIX: Normalize event_id (snake_case from API) → eventId (camelCase for Booking.js)
  const handleBookNow = (event) => {
    setSelectedEventData({
      ...event,
      eventId: event.eventId || event.event_id,  // ✅ covers both cases
    });
    setActivePage("bookings");
  };

  const eventsToShow = selectedDate ? filteredEvents : events;

  return (
    <div className="user-dashboard">
      <div className="app-shell">
        {/* HEADER */}
        <header className="app-header">
          <div className="brand">EVENTMATE <span>AI</span></div>
          <div className="header-right">
            <button className="profile-pill" onClick={() => setShowProfile(true)}>
              👤 {username}
            </button>
          </div>
        </header>

        <div className="app-main">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <h3>Menu</h3>
            <button
              className={`nav-btn ${activePage === "home" ? "active" : ""}`}
              onClick={() => setActivePage("home")}
            >
              🏠 Home
            </button>
            <button
              className={`nav-btn ${activePage === "events" ? "active" : ""}`}
              onClick={() => setActivePage("events")}
            >
              📅 Browse Events
            </button>
            <button
              className={`nav-btn ${activePage === "bookings" ? "active" : ""}`}
              onClick={() => setActivePage("bookings")}
            >
              🎫 My Bookings
            </button>
            <button className="nav-btn logout-side" onClick={handleLogout}>
              🚪 Logout
            </button>
          </aside>

          {/* MAIN CONTENT */}
          <section className="main-content">

            {/* HOME */}
            {activePage === "home" && (
              <div className="content-card">
                <h2>Welcome, {username}! 👋</h2>
                {events.length > 0 && events[currentIndex] && (
                  <div className="slider-container">
                    <img
                      src={
                        events[currentIndex]?.image
                          ? `data:image/jpeg;base64,${events[currentIndex].image}`
                          : "https://via.placeholder.com/600x300?text=Event"
                      }
                      alt={events[currentIndex]?.title || "Event"}
                      className="slider-image"
                    />
                    <div className="slider-overlay">
                      <h1>{events[currentIndex]?.title}</h1>
                      <p>📍 {events[currentIndex]?.venue}</p>
                      <p>🪑 Seats: {events[currentIndex]?.capacity}</p>
                      <p>💰 Price: ₹{events[currentIndex]?.price}</p>
                      {/* ✅ FIXED: uses handleBookNow to normalize eventId */}
                      <button
                        className="live-btn"
                        onClick={() => handleBookNow(events[currentIndex])}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                )}
                {events.length === 0 && (
                  <p style={{ color: "#888", marginTop: "20px" }}>
                    No upcoming events available.
                  </p>
                )}
              </div>
            )}

            {/* EVENTS */}
            {activePage === "events" && (
              <div className="content-card">
                <h2>Browse Events</h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="date-input"
                  />
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate("")}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#444",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="events-list">
                  {eventsToShow.length > 0 ? (
                    eventsToShow.map((event) => (
                      <div key={event.event_id} className="event-card">
                        <img
                          src={
                            event?.image
                              ? `data:image/jpeg;base64,${event.image}`
                              : "https://via.placeholder.com/300x180?text=Event"
                          }
                          alt={event?.title || "Event"}
                          className="event-image"
                        />
                        <h3>{event?.title}</h3>
                        <p>📍 {event?.venue}</p>
                        <p>
                          📅{" "}
                          {event?.event_date
                            ? new Date(event.event_date).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "Date TBD"}
                        </p>
                        <p>🪑 Seats: {event?.capacity}</p>
                        <p>💰 Price: ₹{event?.price}</p>
                        {/* ✅ FIXED: uses handleBookNow to normalize eventId */}
                        <button
                          className="book-btn"
                          onClick={() => handleBookNow(event)}
                        >
                          Book Now
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={{ marginTop: "20px", color: "#f87171" }}>
                      {selectedDate
                        ? "No events found on this date."
                        : "No events available."}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* BOOKINGS */}
            {activePage === "bookings" && (
              <Booking
                selectedEventData={selectedEventData}
                currentUser={loggedUser}
              />
            )}

          </section>
        </div>
      </div>

      {/* PROFILE MODAL */}
      {showProfile && (
        <div className="profile-modal">
          <div className="profile-card">
            <h3>👤 User Profile</h3>
            <input
              type="text"
              placeholder="Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <input
              type="email"
              value={profile.email}
              disabled
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            />
            <input
              type="text"
              placeholder="Phone"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
            <div className="profile-actions">
              <button onClick={handleProfileSave}>Save</button>
              <button onClick={() => setShowProfile(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;