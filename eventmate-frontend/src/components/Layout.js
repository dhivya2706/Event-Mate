import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

function Layout() {

  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  const email = storedUser?.email;

  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const [organizer, setOrganizer] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    companyName: "",
  });

  useEffect(() => {
    if (!storedUser || role !== "ORGANIZER") {
      navigate("/login");
    }
  }, [navigate]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        "http://localhost:8080/api/organizer/profile",
        organizer
      );

      setOrganizer(res.data);   // 🔥 update everywhere
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
      <div className="layout">

        <div className="sidebar">
          <h2 className="logo">EventMate AI</h2>
          <ul>
            <li onClick={() => navigate("/organizer")}>Home</li>
            <li onClick={() => navigate("/organizer/add-event")}>Add Events</li>
            <li onClick={() => navigate("/organizer/booking-monitor")}>Booking Monitoring</li>
            <li onClick={() => navigate("/organizer/manage-events")}>Manage Events</li>
            <li onClick={handleLogout} style={{ color: "red" }}>Logout</li>
          </ul>
        </div>

        <div className="main">
          <div className="top-navbar">
            <h2>Organizer Dashboard</h2>
            <button className="profile-btn" onClick={() => setShowProfile(true)}>
              {organizer.name}
            </button>
          </div>

          {/* 🔥 PASS ORGANIZER HERE */}
          <div className="content-area">
            <Outlet context={{ organizer, setOrganizer }} />
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
                  onChange={(e) =>
                    setOrganizer({ ...organizer, name: e.target.value })
                  }
                  placeholder="Name"
                  required
                />

                <input type="email" value={organizer.email} readOnly />

                <input
                  type="text"
                  value={organizer.phone}
                  onChange={(e) =>
                    setOrganizer({ ...organizer, phone: e.target.value })
                  }
                  placeholder="Phone"
                  required
                />

                <input
                  type="text"
                  value={organizer.companyName}
                  onChange={(e) =>
                    setOrganizer({ ...organizer, companyName: e.target.value })
                  }
                  placeholder="Company"
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

export default Layout;