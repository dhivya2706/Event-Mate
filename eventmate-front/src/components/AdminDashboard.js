import { useState } from "react";
import "../styles/AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "users":
        return (
          <>
            <h3>User & Organizer Management</h3>
            <ul>
              <li>View all registered users & organizers</li>
              <li>Activate / Deactivate accounts</li>
              <li>Monitor suspicious or inactive users</li>
            </ul>
          </>
        );

      case "events":
        return (
          <>
            <h3>Event Oversight & Control</h3>
            <ul>
              <li>View all events created by organizers</li>
              <li>Approve / Reject / Disable events</li>
              <li>Edit or delete events if required</li>
            </ul>
          </>
        );

      case "bookings":
        return (
          <>
            <h3>Booking & Ticket Monitoring</h3>
            <ul>
              <li>View all bookings across events</li>
              <li>Track seat availability & capacity</li>
              <li>Monitor QR ticket generation</li>
            </ul>
          </>
        );

      case "reviews":
        return (
          <>
            <h3>Feedback & Review Moderation</h3>
            <ul>
              <li>Review user ratings & comments</li>
              <li>Approve / delete inappropriate reviews</li>
              <li>Highlight top-rated events</li>
            </ul>
          </>
        );

      case "notifications":
        return (
          <>
            <h3>Notification Management</h3>
            <ul>
              <li>Trigger global notifications</li>
              <li>Monitor reminder logs</li>
              <li>Simulate alerts for testing</li>
            </ul>
          </>
        );

      default:
        return <h3>Welcome Admin 👋 <br /> Select any option from sidebar</h3>;
    }
  };

  return (
    <div className="admin-wrapper">
      <aside className="sidebar">
        <h2 className="logo">EventMate</h2>
        <ul>
          <li onClick={() => setActivePage("dashboard")}>Dashboard</li>
          <li onClick={() => setActivePage("users")}>User & Organizers</li>
          <li onClick={() => setActivePage("events")}>Event Control</li>
          <li onClick={() => setActivePage("bookings")}>Bookings</li>
          <li onClick={() => setActivePage("reviews")}>Reviews</li>
          <li onClick={() => setActivePage("notifications")}>Notifications</li>
          <li className="logout" onClick={onLogout}>Logout</li>
        </ul>
      </aside>

      <main className="main">
        <div className="topbar">
          <h2>Admin Dashboard</h2>
          <div className="admin">Admin</div>
        </div>

        <div className="stats">
          <div className="stat-card">Total Users <span>0</span></div>
          <div className="stat-card">Total Organizers <span>0</span></div>
          <div className="stat-card">Events <span>0</span></div>
          <div className="stat-card">Bookings & Payments <span>0</span></div>
        </div>

        <div className="content-box">{renderContent()}</div>
      </main>
    </div>
  );
}

export default AdminDashboard;
