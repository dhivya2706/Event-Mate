import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [stats, setStats] = useState({ users: 0, organisers: 0, admins: 0 });
  const [users, setUsers] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async (role) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/users?role=${role}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`);
      alert("Deleted successfully!");
      fetchStats();
      if (activePage === "users") fetchUsers("USER");
      if (activePage === "organisers") fetchUsers("ORGANISER");
    } catch (err) {
      console.error(err);
      alert("Could not delete user.");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activePage === "users") fetchUsers("USER");
    else if (activePage === "organisers") fetchUsers("ORGANISER");
  }, [activePage]);

  const renderContent = () => {
    if (activePage === "users" || activePage === "organisers") {
      const title = activePage === "users" ? "Users" : "Organizers";
      return (
        <div className="user-table fade-in">
          <h3>{title}</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="fade-row">
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
      return <h3 className="fade-in">Event Control</h3>;
    } else if (activePage === "bookings") {
      return <h3 className="fade-in">Bookings</h3>;
    } else {
      return <h3 className="fade-in">Welcome Admin 👋</h3>;
    }
  };

  return (
    <div className="admin-wrapper">
      <aside className="sidebar">
        <h2 className="logo">EventMate</h2>
        <ul>
          <li className={activePage === "dashboard" ? "active slide" : ""} onClick={() => setActivePage("dashboard")}>Dashboard</li>
          <li className={activePage === "users" ? "active slide" : ""} onClick={() => setActivePage("users")}>Users</li>
          <li className={activePage === "organisers" ? "active slide" : ""} onClick={() => setActivePage("organisers")}>Organizers</li>
          <li className={activePage === "events" ? "active slide" : ""} onClick={() => setActivePage("events")}>Events</li>
          <li className={activePage === "bookings" ? "active slide" : ""} onClick={() => setActivePage("bookings")}>Bookings</li>
          <li className="logout" onClick={onLogout}>Logout</li>
        </ul>
      </aside>

      <main className="main">
        <div className="topbar fade-in">
          <h2>Admin Dashboard</h2>
          <div className="admin">Admin</div>
        </div>

        <div className="stats">
          <div className="stat-card count-up">Users <span>{stats.users}</span></div>
          <div className="stat-card count-up">Organizers <span>{stats.organisers}</span></div>
          <div className="stat-card">Events <span>0</span></div>
          <div className="stat-card">Bookings <span>0</span></div>
        </div>

        <div className="content-box">{renderContent()}</div>
      </main>
    </div>
  );
}

export default AdminDashboard;
