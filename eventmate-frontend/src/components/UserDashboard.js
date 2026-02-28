import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css";
import Booking from "./Booking";

function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const storedEmail = localStorage.getItem("email");
  const storedUsername = localStorage.getItem("username");

  const [username, setUsername] = useState(
    location.state?.username ||
    storedUsername ||
    (storedEmail ? storedEmail.split("@")[0] : "User")
  );

  const [selectedEventData, setSelectedEventData] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!storedEmail) {
      navigate("/", { replace: true });
    }
  }, [navigate, storedEmail]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/events/all");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
  if (activePage !== "bookings") {
    setSelectedEventData(null);
  }
}, [activePage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev =>
        prev === events.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [events]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = events.filter(event => event.eventDate === selectedDate);
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents([]);
    }
  }, [selectedDate, events]);

  useEffect(() => {
    if (!storedEmail) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/user/profile?email=${storedEmail}`
        );
        const data = await res.json();
        setUser(data);
        if (data.name) {
          setUsername(data.name);
          localStorage.setItem("username", data.name);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [storedEmail]);
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost:8080/api/user/profile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );
      const data = await res.json();
      setUser(data);
      setUsername(data.name);
      localStorage.setItem("username", data.name);
      alert("Profile updated!");
      setShowProfile(false);
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="user-dashboard">
      <div className="app-shell">
        {/* HEADER */}
        <header className="app-header">
          <div className="brand">
            EVENTMATE <span>AI</span>
          </div>
          <div className="header-right">
            <button
              className="profile-pill"
              onClick={() => setShowProfile(true)}
            >
              {username}
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
              className={activePage === "events" ? "nav-btn active" : "nav-btn"}
              onClick={() => setActivePage("events")}
            >
              📅 Browse Events
            </button>
            <button
              className={activePage === "bookings" ? "nav-btn active" : "nav-btn"}
              onClick={() => setActivePage("bookings")}
            >
              🎫 My Bookings
            </button>
            <button className="nav-btn logout-side" onClick={handleLogout}>
              🚪 Logout
            </button>
          </aside>

          <section className="main-content">
            {activePage === "home" && (
              <div className="content-card">
                <h2>Welcome to EventMate AI</h2>
                {events.length > 0 && (
                  <div className="slider-container">
                    <img
                      src={`http://localhost:8080/uploads/${events[currentIndex].imageName}`}
                      alt={events[currentIndex].eventName}
                      className="slider-image"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "/path/to/fallback-image.jpg";
                      }}
                    />

                    <div className="slider-overlay">
                      <h1>{events[currentIndex].eventName}</h1>
                      <p>{events[currentIndex].venue}</p>
                      <p>Seats: {events[currentIndex].totalSeats}</p>
                      <p>Price: ₹{events[currentIndex].ticketPrice}</p>
                      <button
                        className="live-btn"
                        onClick={() => {
                          setSelectedEventData(events[currentIndex]);
                          setActivePage("bookings");
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activePage === "events" && (
              <div className="content-card">
                <h2>Browse Events by Date</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-input"
                />
                <div className="events-list">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="event-card">
                      <h3>{event.eventName}</h3>
                      <p>{event.venue}</p>
                      <p>Seats: {event.totalSeats}</p>
                      <p>Price: ₹{event.ticketPrice}</p>
                      <p>{event.eventDate}</p>
                      <button
                        className="book-btn"
                        onClick={() => {
                          setSelectedEventData(event);
                          setActivePage("bookings");
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePage === "bookings" && (
              <Booking selectedEventData={selectedEventData} />
            )}
          </section>
        </div>
        {showProfile && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>User Profile</h3>
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={user.name || ""}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  required
                />
                <input type="email" value={user.email || ""} readOnly />
                <input
                  type="text"
                  value={user.phone || ""}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  required
                />
                <div className="modal-buttons">
                  <button type="submit" className="save-btn">Save</button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowProfile(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
