import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

// Dashboards
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import OrganizerHome from "./components/OrganizerHome";

// Organizer Pages
import Organizer from "./components/Organizer"; // Booking Monitoring page
import BookingManagement from "./components/BookingManagement"; // Booking & Attendee Management
import AddEvent from "./components/AddEvent";
import EventList from "./components/EventList";
import QRCodeBooking from "./components/QRCodeBooking"; // QR Code Ticket Handling page

import "./App.css";

function App() {
  const [page, setPage] = useState("HOME");
  const [currentUser, setCurrentUser] = useState(null);

  // ================= AUTO LOGIN CHECK =================
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      const savedRole = localStorage.getItem("adminRole");
      const savedEmail = localStorage.getItem("adminEmail");
      const savedName = localStorage.getItem("adminName");
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");

      if (savedRole && savedEmail) {
        const userData = {
          id: savedUser?.id || null,
          role: savedRole,
          email: savedEmail,
          name: savedName || savedUser?.name || savedEmail.split("@")[0],
        };

        setCurrentUser(userData);

        const role = savedRole.toUpperCase().trim();

        if (role === "ADMIN") setPage("ADMIN");
        else if (role === "ORGANISER" || role === "ORGANIZER") setPage("ORGANIZER_HOME");
        else setPage("USER_DASHBOARD");
      }
    }
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setPage("HOME");
  };

  // ================= ROLE BASED RENDER =================
  if (currentUser) {
    const role = currentUser.role?.toUpperCase().trim();

    // ===== ADMIN =====
    if (role === "ADMIN") {
      return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
    }

    // ===== ORGANIZER =====
    if (role === "ORGANISER" || role === "ORGANIZER") {
      if (page === "ORGANIZER_HOME") {
        return (
          <OrganizerHome
            user={currentUser}
            onLogout={handleLogout}
            goToAddEvent={() => setPage("ADD_EVENT")}
            goToEventList={() => setPage("EVENT_LIST")}
            goToBookingManagement={() => setPage("BOOKING_MANAGEMENT")}
            goToBookingMonitoring={() => setPage("BOOKING_MONITORING")}
            goToQRCodeBooking={() => setPage("QR_CODE_BOOKING")} // QR code page
          />
        );
      }
      if (page === "ADD_EVENT")
        return <AddEvent user={currentUser} goBack={() => setPage("ORGANIZER_HOME")} />;
      if (page === "EVENT_LIST")
        return <EventList goBack={() => setPage("ORGANIZER_HOME")} />;
      if (page === "BOOKING_MANAGEMENT")
        return <BookingManagement goBack={() => setPage("ORGANIZER_HOME")} />;
      if (page === "BOOKING_MONITORING")
        return <Organizer goBack={() => setPage("ORGANIZER_HOME")} />;
      if (page === "QR_CODE_BOOKING")
        return <QRCodeBooking goBack={() => setPage("ORGANIZER_HOME")} />;
    }

    // ===== USER =====
    if (role === "USER") {
      return (
        <UserDashboard
          user={currentUser}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      );
    }
  }

  // ===== NOT LOGGED IN =====
  return (
    <>
      <Navbar onLogin={() => setPage("LOGIN")} />
      {page === "HOME" && <Home onLogin={() => setPage("LOGIN")} />}
      {page === "LOGIN" && (
        <Login
          switchToRegister={() => setPage("REGISTER")}
          setCurrentUser={(user) => {
            setCurrentUser(user);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("adminRole", user.role);
            localStorage.setItem("adminEmail", user.email);
            localStorage.setItem("adminName", user.name || "");
            const role = user.role?.toUpperCase().trim();
            if (role === "ADMIN") setPage("ADMIN");
            else if (role === "ORGANISER" || role === "ORGANIZER") setPage("ORGANIZER_HOME");
            else setPage("USER_DASHBOARD");
          }}
        />
      )}
      {page === "REGISTER" && <Register switchToLogin={() => setPage("LOGIN")} />}
    </>
  );
}

export default App;