import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const images = [
  "/image/sport.png",
  "/image/concert.png",
  "/image/promotion.png"
];

function Dashboard() {
  const [activePage, setActivePage] = useState("home");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    },3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-shell">
      
      {/* HEADER */}
      <header className="app-header">
        <div className="brand">EVENTMATE <span>AI</span></div>
        <button className="profile-btn">👤 Profile</button>
      </header>

      <div className="app-main">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <h3>Menu</h3>
          <button
            className={activePage === "home" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActivePage("home")}
          >
            🏠 Home
          </button>

          <button
            className={activePage === "events" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActivePage("events")}
          >
            🎫 Events
          </button>

          <button
            className={activePage === "bookings" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActivePage("bookings")}
          >
            📂 My Bookings
          </button>

          <button className="nav-btn">⏰ Event Reminders</button>
          <button className="nav-btn">💬 Submit Feedback</button>
        </aside>

        {/* MAIN CONTENT */}
        <section className="main-content">

          {activePage === "home" && (
            <div className="content-card">
              <h2>Welcome to EventMate AI</h2>
              <p>Your moving slides / hero carousel is shown below.</p>

              <div className="slider-container">
                <img
                  src={images[currentIndex]}
                  alt="event"
                  className="slider-image"
                />

                <div className="slider-overlay">
                  <h1>Dynamic Sports Event</h1>
                  <p>Experience the Thrill</p>
                  <button className="live-btn">Live Now</button>
                </div>
              </div>
            </div>
          )}

          {activePage === "events" && (
            <div className="content-card">
              <h2>Public Events</h2>
              <p>Events list will appear here.</p>
            </div>
          )}

          {activePage === "bookings" && (
            <div className="content-card">
              <h2>My Bookings</h2>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}

export default Dashboard;
