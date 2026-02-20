import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import OrganizerHome from "./components/OrganizerHome";
import BookingMonitoring from "./components/BookingMonitoring";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Organizer Dashboard */}
        <Route path="/organizer" element={<OrganizerHome />} />
        <Route path="/booking-monitoring" element={<BookingMonitoring />} />
      </Routes>
    </Router>
  );
}

export default App;