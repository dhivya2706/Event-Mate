import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const email = localStorage.getItem("email");

  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const [organizer, setOrganizer] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    companyName: ""
  });

  // 🚫 block access if not logged in
  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }
  }, [email, navigate]);

  // ✅ fetch organizer profile
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
        setLoading(false);
      }
    };

    fetchProfile();
  }, [email]);

  // ✅ update profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:8080/api/organizer/profile",
        organizer
      );
      alert("Profile Updated Successfully!");
      setShowProfile(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  // ✅ logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <p style={{ padding: 20 }}>Loading profile...</p>;

  return (
    <div className="app-wrapper">
      <div className="layout">

        {/* SIDEBAR */}
        <div className="sidebar">
          <h2 className="logo">EventMate AI</h2>

          <ul>
            <li
              className={location.pathname === "/" ? "active" : ""}
              onClick={() => navigate("/")}
            >
              Home
            </li>

            <li
              className={location.pathname === "/add-event" ? "active" : ""}
              onClick={() => navigate("/add-event")}
            >
              Add Events
            </li>

            <li
              className={location.pathname === "/booking-monitoring" ? "active" : ""}
              onClick={() => navigate("/booking-monitoring")}
            >
              Booking Monitoring
            </li>

            <li onClick={handleLogout} style={{ color: "red" }}>
              Logout
            </li>
          </ul>
        </div>

        {/* MAIN */}
        <div className="main">

          {/* TOP BAR */}
          <div className="top-navbar">
            <h2>Organizer Dashboard</h2>

            <button
              className="profile-btn"
              onClick={() => setShowProfile(true)}
            >
              {organizer.name || "Profile"}
            </button>
          </div>

          {/* PAGE CONTENT */}
          <div className="content-area">{children}</div>
        </div>

        {/* PROFILE MODAL */}
        {showProfile && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Update Organizer Profile</h3>

              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={organizer.name}
                  onChange={(e) =>
                    setOrganizer({ ...organizer, name: e.target.value })
                  }
                  placeholder="Name"
                />

                <input
                  type="email"
                  value={organizer.email}
                  readOnly
                />

                <input
                  type="text"
                  value={organizer.phone}
                  onChange={(e) =>
                    setOrganizer({ ...organizer, phone: e.target.value })
                  }
                  placeholder="Phone"
                />

                <input
                  type="text"
                  value={organizer.companyName}
                  onChange={(e) =>
                    setOrganizer({ ...organizer, companyName: e.target.value })
                  }
                  placeholder="Company"
                />

                <div className="modal-buttons">
                  <button type="submit" className="save-btn">
                    Save
                  </button>

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

export default Layout;