import React, { useState } from "react";
import "../styles/UserDashboard.css";

import Dashboard from "./Dashboard";
import AddEvent from "./AddEvent";
import BookingManagement from "./BookingManagement";
import QRCodeBooking from "./QRCodeBooking";
import EventList from "./EventList";
import FeedbackDetails from "./FeedbackDetails";
import Organizer from "./Organizer";
import OrganizerProfile from "./OrganizerProfile";

function OrganizerHome() {

  const [activePage, setActivePage] = useState("dashboard");

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const organizerName =
    localStorage.getItem("username") || "Organizer";

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="user-dashboard">

      <div className="app-shell">

        {/* HEADER */}
        <header className="app-header">

          <div className="brand">
            EVENTMATE ORGANIZER
          </div>

          <button
            className="profile-pill"
            onClick={() => setActivePage("profile")}
          >
            👤 {organizerName}
          </button>

        </header>


        <div className="app-main">

          {/* SIDEBAR */}
          <aside className="sidebar">

            <h3>Organizer Menu</h3>

            <button
              className={`nav-btn ${activePage === "dashboard" ? "active" : ""}`}
              onClick={() => setActivePage("dashboard")}
            >
              🏠 Dashboard
            </button>

            <button
              className={`nav-btn ${activePage === "addEvent" ? "active" : ""}`}
              onClick={() => setActivePage("addEvent")}
            >
              ➕ Add Event
            </button>

            <button
              className={`nav-btn ${activePage === "eventList" ? "active" : ""}`}
              onClick={() => setActivePage("eventList")}
            >
              🖼 Event Media
            </button>

            <button
              className={`nav-btn ${activePage === "bookingManagement" ? "active" : ""}`}
              onClick={() => setActivePage("bookingManagement")}
            >
              🎫 Booking Management
            </button>

            <button
              className={`nav-btn ${activePage === "monitoring" ? "active" : ""}`}
              onClick={() => setActivePage("monitoring")}
            >
              📊 Booking Monitoring
            </button>

            <button
              className={`nav-btn ${activePage === "qr" ? "active" : ""}`}
              onClick={() => setActivePage("qr")}
            >
              📱 QR Ticket
            </button>

            <button
              className={`nav-btn ${activePage === "notification" ? "active" : ""}`}
              onClick={() => setActivePage("notification")}
            >
              🔔 Notifications
            </button>

            <button
              className="nav-btn logout-side"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>

          </aside>


          {/* MAIN CONTENT */}
          <section className="main-content">

            {activePage === "dashboard" && <Dashboard />}

            {activePage === "addEvent" && <AddEvent />}

            {activePage === "eventList" && <EventList />}

            {activePage === "bookingManagement" && <BookingManagement user={user} />}

            {activePage === "monitoring" && <Organizer user={user} />}

            {activePage === "qr" && <QRCodeBooking />}

            {activePage === "notification" && <FeedbackDetails />}

            {activePage === "profile" && <OrganizerProfile />}

          </section>

        </div>

      </div>

    </div>
  );
}

export default OrganizerHome;