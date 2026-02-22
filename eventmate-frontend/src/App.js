import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import OrganizerHome from "./components/OrganizerHome";
import AddEvent from "./components/AddEvent";
import BookingMonitoring from "./components/BookingMonitoring";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/organizer" element={<Layout />}>
        <Route index element={<OrganizerHome />} />
        <Route path="add-event" element={<AddEvent />} />
        <Route path="booking-monitor" element={<BookingMonitoring />} />
      </Route>

    </Routes>
  );
}

export default App;