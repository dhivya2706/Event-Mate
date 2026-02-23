import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import OrganizerHome from "./components/OrganizerHome";
import AddEvent from "./components/AddEvent";
import BookingMonitoring from "./components/BookingMonitoring";
import ManageEvents from "./components/ManageEvents";
import EditEvent from "./components/EditEvent";
import UserRegister from "./components/UserRegister";
import UserDashboard from "./components/UserDashboard";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User */}
      <Route path="/user-register" element={<UserRegister />} />
      <Route path="/user" element={<UserDashboard />} />

      {/* Organizer */}
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