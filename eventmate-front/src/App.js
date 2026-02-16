import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

function App() {
  const [page, setPage] = useState("HOME");
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ ROLE BASED REDIRECT
  if (currentUser) {
    const role = currentUser.role?.toUpperCase();

    if (role === "ADMIN") {
      return (
        <AdminDashboard
          user={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            setPage("LOGIN");
          }}
        />
      );
    } else {
      return (
        <Dashboard
          user={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            setPage("LOGIN");
          }}
        />
      );
    }
  }

  return (
    <>
      <Navbar onLogin={() => setPage("LOGIN")} />

      {page === "HOME" && <Home onLogin={() => setPage("LOGIN")} />}

      {page === "LOGIN" && (
        <Login
          switchToRegister={() => setPage("REGISTER")}
          setCurrentUser={setCurrentUser}
        />
      )}

      {page === "REGISTER" && (
        <Register switchToLogin={() => setPage("LOGIN")} />
      )}
    </>
  );
}

export default App;
