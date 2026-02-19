import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import OrganizerHome from "./components/OrganizerHome";
import BookingMonitoring from "./components/BookingMonitoring";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrganizerHome />} />
        <Route path="/booking-monitoring" element={<BookingMonitoring />} />
      </Routes>
    </Router>
  );
}

export default App;
