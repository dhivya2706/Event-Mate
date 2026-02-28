// Dashboard.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Booking from "./Booking";

/* 🔹 Slider Data (Image + Text Together) */
const sliderData = [
  {
    image: "/image/sport.png",
    title: "Grand Cricket League",
    subtitle: "Catch Every Boundary & Wicket Live!",
    buttonText: "Reserve Your Seat Now",
  },
  {
    image: "/image/concert.png",
    title: "Live Music Concert",
    subtitle: "Experience the Sound Live",
    buttonText: "Book Concert",
  },
  {
    image: "/image/promotion.png",
    title: "Tech Expo 2026",
    subtitle: "Discover Future Innovations",
    buttonText: "Explore Expo",
  },
];

const eventData = [
  { id: 1, title: "Football Championship", date: "2026-02-20", location: "City Stadium" },
  { id: 2, title: "Live Music Concert", date: "2026-02-22", location: "Downtown Arena" },
  { id: 3, title: "Tech Expo 2026", date: "2026-02-22", location: "Convention Center" },
];

function Dashboard() {
  const [activePage, setActivePage] = useState("home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ SAFER USERNAME (fallback to email before @)
  const storedUsername = localStorage.getItem("username");
  const storedEmail = localStorage.getItem("email");

  const username =
    location.state?.username ||
    (storedUsername && storedUsername !== "null" && storedUsername !== "undefined"
      ? storedUsername
      : storedEmail
        ? storedEmail.split("@")[0]
        : "User");

  // ✅ SAFER AVATAR LETTER
  const avatarLetter = (username?.[0] || "U").toUpperCase();

  /* 🔹 Redirect if not logged in */
  useEffect(() => {
    if (!localStorage.getItem("email")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  const goToProfile = () => {
    setIsProfileMenuOpen(false);
    navigate("/profile");
  };

  /* 🔹 Auto Slider Change */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* 🔹 Filter Events by Date */
  useEffect(() => {
    if (selectedDate) {
      const events = eventData.filter((event) => event.date === selectedDate);
      setFilteredEvents(events);
    } else {
      setFilteredEvents([]);
    }
  }, [selectedDate]);

  return (
    <div className="app-shell">
      {/* HEADER */}
      <header className="app-header">
        <div className="brand">
          EVENTMATE <span>AI</span>
        </div>

        <div className="header-right">
          <span className="welcome-text">Welcome, {username}</span>

          <div className="profile-wrapper">
            <button
              className="avatar-btn"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            >
              {avatarLetter}
            </button>

            {isProfileMenuOpen && (
              <div className="profile-menu">
                <div className="profile-menu-username">{username}</div>

                <button className="profile-menu-item" onClick={goToProfile}>
                  Profile
                </button>

                <button className="profile-menu-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN SECTION */}
      <div className="app-main">
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
            📂 My Bookings
          </button>

          <button
            className={activePage === "bookings" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActivePage("bookings")}
          >
            🎫 Events
          </button>

          <button className="nav-btn">⏰ Event Reminders</button>
          <button className="nav-btn">💬 Submit Feedback</button>
        </aside>

        <section className="main-content">
          {/* HOME PAGE */}
          {activePage === "home" && (
            <div className="content-card">
              <h2>Welcome to EventMate AI</h2>

              <div className="slider-container">
                <img
                  src={sliderData[currentIndex].image}
                  alt="event"
                  className="slider-image"
                />

                <div className="slider-overlay">
                  <h1>{sliderData[currentIndex].title}</h1>
                  <p>{sliderData[currentIndex].subtitle}</p>
                  <button className="live-btn">
                    {sliderData[currentIndex].buttonText}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EVENTS PAGE */}
          {activePage === "events" && (
            <div className="content-card">
              <h2>📅 Browse Events by Date</h2>

              <div className="calendar-box">
                <label>Select Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-input"
                />
              </div>

              <div className="events-list">
                {selectedDate && filteredEvents.length === 0 && (
                  <p>No events found for this date.</p>
                )}

                {filteredEvents.map((event) => (
                  <div key={event.id} className="event-card">
                    <h3>{event.title}</h3>
                    <p>📍 {event.location}</p>
                    <p>📅 {event.date}</p>
                    <button className="book-btn">Book Now</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOOKINGS PAGE */}
          {activePage === "bookings" && <Booking />}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;