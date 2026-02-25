import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/AdminDashboard.module.css";

function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [stats, setStats] = useState({ users: 0, organisers: 0, admins: 0, events: 0, bookings: 0 });
  const [users, setUsers] = useState([]);
  const [adminProfile, setAdminProfile] = useState({ name: "", email: "" });
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("adminToken");

  // FETCH STATS
  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(prev => ({ ...prev, users: res.data.users, organisers: res.data.organisers, admins: res.data.admins }));
    } catch (err) { console.error(err); }
  };

  // FETCH USERS BY ROLE
  const fetchUsers = async (role) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/users?role=${role}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  // FETCH ADMIN PROFILE
  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminProfile(res.data);
    } catch (err) { console.error(err); }
  };

  // FETCH EVENTS
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
      setStats(prev => ({ ...prev, events: res.data.length }));
    } catch (err) { console.error(err); }
  };

  // FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
      setStats(prev => ({ ...prev, bookings: res.data.length }));
    } catch (err) { console.error(err); }
  };

  // DELETE USER
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Deleted successfully!");
      fetchStats();
      if (activePage === "users") fetchUsers("USER");
      if (activePage === "organisers") fetchUsers("ORGANISER");
    } catch (err) { console.error(err); alert("Could not delete user."); }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchStats();
    fetchAdminProfile();
  }, []);

  // FETCH ON TAB CHANGE
  useEffect(() => {
    if (activePage === "users") fetchUsers("USER");
    else if (activePage === "organisers") fetchUsers("ORGANISER");
    else if (activePage === "events") fetchEvents();
    else if (activePage === "bookings") fetchBookings();
  }, [activePage]);

  // RENDER CONTENT BASED ON ACTIVE PAGE
  const renderContent = () => {
    if (activePage === "users" || activePage === "organisers") {
      const title = activePage === "users" ? "Users" : "Organizers";
      return (
        <div className={`${styles.userTable} ${styles.fadeIn}`}>
          <h3>{title}</h3>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className={styles.fadeRow}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <button onClick={() => deleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (activePage === "events") {
      return (
        <div className={`${styles.userTable} ${styles.fadeIn}`}>
          <h3>Events</h3>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Title</th><th>Venue</th><th>Date</th><th>Capacity</th><th>Price</th>
                </tr>
              </thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.eventId}>
                    <td>{e.eventId}</td>
                    <td>{e.title}</td>
                    <td>{e.venue}</td>
                    <td>{new Date(e.eventDate).toLocaleString()}</td>
                    <td>{e.capacity}</td>
                    <td>{e.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (activePage === "bookings") {
      return (
        <div className={`${styles.userTable} ${styles.fadeIn}`}>
          <h3>Bookings</h3>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Event ID</th><th>Seats</th><th>Total Amount</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.eventId}</td>
                    <td>{b.seatsBooked}</td>
                    <td>{b.totalAmount}</td>
                    <td>{new Date(b.bookingDate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (activePage === "profile") {
      return (
        <div className={`${styles.fadeIn} ${styles.profileCard}`}>
          <h3>Admin Profile</h3>
          <p><strong>Name:</strong> {adminProfile.name}</p>
          <p><strong>Email:</strong> {adminProfile.email}</p>
        </div>
      );
    } else {
      return <h3 className={styles.fadeIn}>Welcome Admin 👋</h3>;
    }
  };

  return (
    <div className={styles.adminWrapper}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>EventMate</h2>
        <ul>
          <li className={activePage === "dashboard" ? `${styles.active} ${styles.slide}` : ""} onClick={() => setActivePage("dashboard")}>Dashboard</li>
          <li className={activePage === "users" ? `${styles.active} ${styles.slide}` : ""} onClick={() => setActivePage("users")}>Users</li>
          <li className={activePage === "organisers" ? `${styles.active} ${styles.slide}` : ""} onClick={() => setActivePage("organisers")}>Organizers</li>
          <li className={activePage === "events" ? `${styles.active} ${styles.slide}` : ""} onClick={() => setActivePage("events")}>Events</li>
          <li className={activePage === "bookings" ? `${styles.active} ${styles.slide}` : ""} onClick={() => setActivePage("bookings")}>Bookings</li>
          <li className={activePage === "reviews" ? `${styles.active} ${styles.slide}` : ""} onClick={() => setActivePage("reviews")}>Reviews</li>
          <li className={activePage === "profile" ? `${styles.active} ${styles.slide}` : ""} onClick={() => setActivePage("profile")}>Profile</li>
          <li className={styles.logout} onClick={onLogout}>Logout</li>
        </ul>
      </aside>
      <main className={styles.main}>
        <div className={`${styles.topbar} ${styles.fadeIn}`}>
          <h2>Admin Dashboard</h2>
          <div className={styles.admin}>Admin</div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>Users <span>{stats.users}</span></div>
          <div className={styles.statCard}>Organizers <span>{stats.organisers}</span></div>
          <div className={styles.statCard}>Events <span>{stats.events}</span></div>
          <div className={styles.statCard}>Bookings <span>{stats.bookings}</span></div>
        </div>

        <div className={styles.contentBox}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;