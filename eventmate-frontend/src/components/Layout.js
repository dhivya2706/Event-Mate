import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

function Layout() {
  const [events, setEvents] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  let storedUser = null;
  try {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      storedUser = JSON.parse(userData);
    }
  } catch (error) {
    console.error("Invalid user in localStorage");
  }

  const role = localStorage.getItem("role");
  const email = storedUser?.email;

  const [organizer, setOrganizer] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    companyName: "",
  });

  useEffect(() => {
    if (!email) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/organizer/profile?email=${email}`
        );
        setOrganizer(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [email]);

  useEffect(() => {
    if (!email) return;

    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/organizer/events?email=${email}`
        );
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, [email]);

  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [events]);

  useEffect(() => {
    if (!storedUser || role !== "ORGANIZER") {
      navigate("/login");
    }
  }, [storedUser, role, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:8080/api/organizer/profile",
        organizer
      );
      setOrganizer(res.data);
      setShowProfile(false);
      alert("Profile Updated Successfully!");
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="app-wrapper">
      <div className="top-navbar">
        <h2 className="app-title">EVENTMATE AI</h2>
        <button className="profile-btn top-profile" onClick={() => setShowProfile(true)}>
          {organizer.name}
        </button>
      </div>

      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div style={{ height: "10px" }}></div>
          <ul>
            <li onClick={() => navigate("/organizer")}>🏠 Home</li>
            <li onClick={() => navigate("/organizer/add-event")}>➕ Add Events</li>
            <li onClick={() => navigate("/organizer/booking-monitor")}>📊 Booking Monitor</li>
            <li onClick={() => navigate("/organizer/manage-events")}>🎟 Manage Events</li>
            <li onClick={handleLogout} style={{ color: "#ff4d4f" }}>🚪 Logout</li>
          </ul>
        </div>

        <div className="main">
          <div className="content-area">
            {location.pathname === "/organizer" && events.length > 0 && (
              <div className="content-card">
                <h2>Welcome {organizer.name}</h2>

                <div className="slider-container">
                  <img
                    src={`http://localhost:8080/uploads/${events[currentIndex].imageName}`}
                    alt={events[currentIndex].eventName}
                    className="slider-image"
                    onError={(e) => {
                      e.target.onerror = null;
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
                      onClick={() =>
                        navigate(`/organizer/manage-events/edit/${events[currentIndex].id}`)
                      }
                    >
                      Manage Event
                    </button>
                  </div>
                </div>
              </div>
            )}

            {location.pathname !== "/organizer" && (
              <Outlet context={{ organizer, setOrganizer }} />
            )}
          </div>
        </div>
      </div>

      {showProfile && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Organizer Profile</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={organizer.name}
                onChange={(e) => setOrganizer({ ...organizer, name: e.target.value })}
                placeholder="Name"
                required
              />
              <input type="email" value={organizer.email} readOnly />
              <input
                type="text"
                value={organizer.phone}
                onChange={(e) => setOrganizer({ ...organizer, phone: e.target.value })}
                placeholder="Phone"
                required
              />
              <input
                type="text"
                value={organizer.companyName}
                onChange={(e) => setOrganizer({ ...organizer, companyName: e.target.value })}
                placeholder="Company"
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowProfile(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;