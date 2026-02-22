import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import OrganizerHome from "./components/OrganizerHome";
import AddEvent from "./components/AddEvent";
import BookingMonitoring from "./components/BookingMonitoring";
import ManageEvents from "./components/ManageEvents";
import EditEvent from "./components/EditEvent"; 
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/organizer" element={<Layout />}>
        <Route index element={<OrganizerHome />} />
        <Route path="add-event" element={<AddEvent />} />
        <Route path="booking-monitor" element={<BookingMonitoring />} />
        <Route path="manage-events" element={<ManageEvents />} />
        <Route path="manage-events/edit/:id" element={<EditEvent />} />
      </Route>
    </Routes>
  );
}

export default App;