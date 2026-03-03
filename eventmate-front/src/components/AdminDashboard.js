import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/AdminDashboard.module.css";

function AdminDashboard({ onLogout }) {

  const [activePage, setActivePage] = useState("dashboard");

  const [stats, setStats] = useState({
    users: 0,
    organisers: 0,
    admins: 0,
    events: 0,
    bookings: 0
  });

  const [users, setUsers] = useState([]);
  const [adminProfile, setAdminProfile] = useState({ name: "", email: "" });
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  const email = localStorage.getItem("adminEmail");

  // ================= FETCH STATS =================
  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  // ================= FETCH USERS =================
  const fetchUsers = async (role) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/users?role=${role}`
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Users error:", err);
    }
  };

  // ================= FETCH PROFILE =================
  const fetchAdminProfile = async () => {
    try {
      if (!email) return;

      const res = await axios.get(
        `http://localhost:8080/api/admin/profile?email=${email}`
      );

      setAdminProfile(res.data);
    } catch (err) {
      console.error("Profile error:", err);
    }
  };

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/events");
      setEvents(res.data);
      setStats(prev => ({ ...prev, events: res.data.length }));
    } catch (err) {
      console.error("Events error:", err);
    }
  };

  // ================= FETCH BOOKINGS =================
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/bookings");
      setBookings(res.data);
      setStats(prev => ({ ...prev, bookings: res.data.length }));
    } catch (err) {
      console.error("Bookings error:", err);
    }
  };

  // ================= FETCH REVIEWS =================
  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/feedback");
      setReviews(res.data);
    } catch (err) {
      console.error("Reviews error:", err);
    }
  };

  // ================= DELETE USER =================
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`);
      fetchUsers("USER");
      fetchStats();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchStats();
    fetchAdminProfile();
  }, []);

  // ================= TAB SWITCH =================
  useEffect(() => {
    if (activePage === "users") fetchUsers("USER");
    else if (activePage === "organisers") fetchUsers("ORGANISER");
    else if (activePage === "events") fetchEvents();
    else if (activePage === "bookings") fetchBookings();
    else if (activePage === "reviews") fetchReviews();
  }, [activePage]);

  // ================= RENDER CONTENT =================
  const renderContent = () => {

    // USERS & ORGANISERS
    if (activePage === "users" || activePage === "organisers") {
      const title = activePage === "users" ? "Users" : "Organizers";

      return (
        <div className={styles.userTable}>
          <h3>{title}</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
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
      );
    }

    // EVENTS
    if (activePage === "events") {
      return (
        <div className={styles.userTable}>
          <h3>Events</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Title</th><th>Venue</th>
                <th>Date</th><th>Capacity</th><th>Price</th>
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
                  <td>₹{e.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // BOOKINGS
    if (activePage === "bookings") {
      return (
        <div className={styles.userTable}>
          <h3>Bookings</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Event</th><th>Seats</th>
                <th>Amount</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.eventId}</td>
                  <td>{b.seatsBooked}</td>
                  <td style={{color:"#16a34a", fontWeight:"bold"}}>
                    ₹{b.totalAmount}
                  </td>
                  <td>{new Date(b.bookingDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // REVIEWS
    if (activePage === "reviews") {
      return (
        <div className={styles.userTable}>
          <h3>Event Reviews</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Booking</th><th>User</th>
                <th>Event</th><th>Rating</th><th>Comment</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr><td colSpan="7">No Reviews Available</td></tr>
              ) : (
                reviews.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.bookingId}</td>
                    <td>{r.userId}</td>
                    <td>{r.eventId}</td>
                    <td className={styles.ratingStar}>
                      {"⭐".repeat(r.rating)}
                    </td>
                    <td>{r.comment}</td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );
    }

    // PROFILE
    if (activePage === "profile") {
      return (
        <div className={styles.profileCard}>
          <h3>Admin Profile</h3>
          <p><strong>Name:</strong> {adminProfile.name}</p>
          <p><strong>Email:</strong> {adminProfile.email}</p>
        </div>
      );
    }

    return <h3>Welcome Admin 👋</h3>;
  };

  return (
    <div className={styles.adminWrapper}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>EventMate</h2>
        <ul>
          <li onClick={() => setActivePage("dashboard")}>Dashboard</li>
          <li onClick={() => setActivePage("users")}>Users</li>
          <li onClick={() => setActivePage("organisers")}>Organizers</li>
          <li onClick={() => setActivePage("events")}>Events</li>
          <li onClick={() => setActivePage("bookings")}>Bookings</li>
          <li onClick={() => setActivePage("reviews")}>Reviews</li>
          <li onClick={() => setActivePage("profile")}>Profile</li>
          <li className={styles.logout} onClick={onLogout}>Logout</li>
        </ul>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <h2>Admin Dashboard</h2>
          <div className={styles.admin}>Admin</div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>Users <br /> {stats.users}</div>
          <div className={styles.statCard}>Organizers <br /> {stats.organisers}</div>
          <div className={styles.statCard}>Events <br /> {stats.events}</div>
          <div className={styles.statCard}>Bookings <br /> {stats.bookings}</div>
        </div>

        <div className={styles.contentBox}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;