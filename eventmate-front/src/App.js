import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

// Dashboards
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import OrganizerHome from "./components/OrganizerHome";
import Organizer from "./components/Organizer";

import "./App.css";

function App() {

  const [page, setPage] = useState("HOME"); // 🔥 Always HOME first
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Restore login ONLY if isLoggedIn true
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      const savedRole = localStorage.getItem("adminRole");
      const savedEmail = localStorage.getItem("adminEmail");
      const savedName = localStorage.getItem("adminName");

      if (savedRole && savedEmail) {
        const userData = {
          role: savedRole,
          email: savedEmail,
          name: savedName,
        };

        setCurrentUser(userData);

        const role = savedRole.toUpperCase();

        if (role === "ADMIN") setPage("ADMIN");
        else if (role === "ORGANISER" || role === "ORGANIZER")
          setPage("ORGANIZER_HOME");
        else setPage("USER");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setPage("HOME"); // 🔥 Go back to HOME after logout
  };

  // 🔥 ROLE BASED RENDER
  if (currentUser) {

    const role = currentUser.role?.toUpperCase().trim();

    // ADMIN
    if (role === "ADMIN") {
      return (
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      );
    }

    // ORGANIZER FLOW
    if (role === "ORGANISER" || role === "ORGANIZER") {

      if (page === "ORGANIZER_HOME") {
        return (
          <OrganizerHome
            user={currentUser}
            onLogout={handleLogout}
            goToBooking={() => setPage("BOOKING")}
          />
        );
      }

      if (page === "BOOKING") {
        return (
          <Organizer
            user={currentUser}
            onLogout={handleLogout}
            goBack={() => setPage("ORGANIZER_HOME")}
          />
        );
      }
    }

    // USER
    if (role === "USER") {
      return (
        <Dashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      );
    }
  }

  // ❌ NOT LOGGED IN
  return (
    <>
      <Navbar onLogin={() => setPage("LOGIN")} />

      {page === "HOME" && (
        <Home onLogin={() => setPage("LOGIN")} />
      )}

      {page === "LOGIN" && (
        <Login
          switchToRegister={() => setPage("REGISTER")}
          setCurrentUser={(user) => {
            setCurrentUser(user);
            localStorage.setItem("isLoggedIn", "true");
          }}
          setPage={setPage}
        />
      )}

      {page === "REGISTER" && (
        <Register switchToLogin={() => setPage("LOGIN")} />
      )}
    </>
  );
}

export default App;
