import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css";
import ChatBot from "./ChatBot";
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

  const [feedbackEvents, setFeedbackEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");

  const [showChatBot, setShowChatBot] = useState(false);

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
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev =>
        prev === events.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [events]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = events.filter(
        event => event.eventDate === selectedDate
      );
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

  useEffect(() => {
    if (!storedEmail || activePage !== "feedback") return;

    const fetchFeedbackEvents = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/bookings/completed?email=${storedEmail}`
        );

        const data = await res.json();
        console.log("Feedback API:", data);

        if (Array.isArray(data)) {
          setFeedbackEvents(data);
        } else if (Array.isArray(data.data)) {
          setFeedbackEvents(data.data);
        } else {
          setFeedbackEvents([]);
        }

      } catch (err) {
        console.error(err);
        setFeedbackEvents([]);
      }
    };

    fetchFeedbackEvents();
  }, [storedEmail, activePage]);

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

  const goToBooking = (event) => {
    setSelectedEventData(event);
    setActivePage("bookings");
  };

  const submitFeedback = async () => {
    if (!selectedEvent) return;

    try {
      const res = await fetch("http://localhost:8080/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.event?.id,
          userEmail: storedEmail,
          rating: Number(rating),
          description
        })
      });

      if (!res.ok) throw new Error("Failed");

      alert("Feedback submitted successfully!");

      setSelectedEvent(null);
      setDescription("");
      setRating(5);

      setFeedbackEvents(prev =>
        prev.filter(e => e.id !== selectedEvent.id)
      );

    } catch (err) {
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="user-dashboard">
      <div className="app-shell">

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

          <aside className="sidebar">
            <h3>Menu</h3>

            <button className={`nav-btn ${activePage === "home" ? "active" : ""}`} onClick={() => setActivePage("home")}>🏠 Home</button>
            <button className={`nav-btn ${activePage === "events" ? "active" : ""}`} onClick={() => setActivePage("events")}>📅 Browse Events</button>
            <button className={`nav-btn ${activePage === "bookings" ? "active" : ""}`} onClick={() => setActivePage("bookings")}>🎫 My Bookings</button>
            <button className={`nav-btn ${activePage === "feedback" ? "active" : ""}`} onClick={() => setActivePage("feedback")}>⭐ Feedback</button>
            <button
              className="nav-btn"
              onClick={() => setShowChatBot(!showChatBot)}
            >
              🤖 AI Assistant
            </button>
            <button className="nav-btn logout-side" onClick={handleLogout}>🚪 Logout</button>
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
                    />

                    <div className="slider-overlay">
                      <h1>{events[currentIndex].eventName}</h1>
                      <p>{events[currentIndex].venue}</p>
                      <p>VIP: {events[currentIndex].vipSeats} | ₹{events[currentIndex].vipPrice}</p>
                      <p>Premium: {events[currentIndex].premiumSeats} | ₹{events[currentIndex].premiumPrice}</p>
                      <p>Regular: {events[currentIndex].regularSeats} | ₹{events[currentIndex].regularPrice}</p>

                      <button className="live-btn" onClick={() => goToBooking(events[currentIndex])}>
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

                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="date-input" />

                <div className="events-grid">
                  {(selectedDate ? filteredEvents : events).map((event) => (
                    <div key={event.id} className="event-card">
                      <h3>{event.eventName}</h3>
                      <p>{event.venue}</p>
                      <p>{event.eventDate}</p>
                      <p>VIP: {event.vipSeats} | ₹{event.vipPrice}</p>
                      <p>Premium: {event.premiumSeats} | ₹{event.premiumPrice}</p>
                      <p>Regular: {event.regularSeats} | ₹{event.regularPrice}</p>
                      <button className="book-btn" onClick={() => goToBooking(event)}>Book Now</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePage === "bookings" && (
              selectedEventData ? (
                <Booking selectedEventData={selectedEventData} />
              ) : (
                <div className="content-card">
                  <h3>Please select an event to book</h3>
                </div>
              )
            )}

            {activePage === "feedback" && (
              <div className="content-card">
                <h2>Give Feedback</h2>

                {!Array.isArray(feedbackEvents) || feedbackEvents.length === 0 ? (
                  <p>No events available for feedback.</p>
                ) : (
                  <div className="events-grid">
                    {feedbackEvents.map((event) => (
                      <div key={event.id} className="event-card">
                        <h3>{event.event?.eventName}</h3>
                        <p>{event.event?.venue}</p>
                        <p>{event.event?.eventDate}</p>

                        <button
                          className="book-btn"
                          onClick={() => setSelectedEvent(event)}
                        >
                          Give Review
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </section>
        </div>

        {showProfile && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>User Profile</h3>
              <form onSubmit={handleUpdate}>
                <input type="text" value={user.name || ""} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
                <input type="email" value={user.email || ""} readOnly />
                <input type="text" value={user.phone || ""} onChange={(e) => setUser({ ...user, phone: e.target.value })} required />
                <div className="modal-buttons">
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowProfile(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedEvent && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{selectedEvent.event?.eventName}</h3>
              <textarea
                placeholder="Write your feedback..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", height: "120px", resize: "none" }}
              />
              <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
              <div className="modal-buttons">
                <button className="save-btn" onClick={submitFeedback}>Submit</button>
                <button className="cancel-btn" onClick={() => setSelectedEvent(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {showChatBot && <ChatBot />}
      </div>
    </div>
  );
}

export default UserDashboard;