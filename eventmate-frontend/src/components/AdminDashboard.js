import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";
import "../styles/Chat.css";
import { FaEnvelope } from "react-icons/fa";

export default function AdminDashboard() {

  const [openChat, setOpenChat] = useState(false);

  const [active, setActive] = useState("dashboard");
  const [counts, setCounts] = useState({
    users: 0,
    organizers: 0,
    events: 0,
    bookings: 0
  });

  const [messageText, setMessageText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [organizers, setOrganizers] = useState([]);
  const [messages, setMessages] = useState([]);

  const senderId =1;
  const role = localStorage.getItem("role");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/counts");
      setCounts(res.data);
    } catch (error) {
      console.error("Error fetching counts", error);
    }
  };


  const fetchData = async (type) => {
    try {
      setActive(type);
      const res = await axios.get(`http://localhost:8080/api/admin/${type}`);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data", error);
      setData([]);
    }
  };

  const deleteItem = async (type, id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/${type}/${id}`);
      fetchData(type);
      fetchCounts();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    if (openChat && selectedUser) {
      loadMessages(selectedUser);
    }
  }, [openChat, selectedUser]);

  const loadOrganizers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/messages/organizers");
      setOrganizers(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const sendMessage = async () => {

   if (!messageText.trim() || !selectedUser || !senderId) {
  console.log("Invalid message data");
  return;
}

    try {

      await axios.post("http://localhost:8080/api/messages/send", {
        senderId: senderId,
        receiverId: selectedUser,
         senderRole: "ADMIN",
  receiverRole: "ORGANIZER",
        message: messageText
      });

      setMessageText("");

      loadMessages(selectedUser);

    } catch (err) {
      console.log(err);
    }

  }

  const loadMessages = async (receiverId) => {

    try {

      const res = await axios.get(
        `http://localhost:8080/api/messages/chat?user1=${senderId}&user2=${receiverId}`
      );

      setMessages(res.data);

    } catch (err) {
      console.log(err);
    }

  }

  return (
    <div className="admin-wrapper">

      <div className="admin-header">
        <h2 className="logo">EVENTMATE AI</h2>
        <FaEnvelope
          className="message-icon"
          onClick={() => {
            setOpenChat(true);
            loadOrganizers();
          }}
        />
        <div className="profile-pill">Admin</div>
      </div>

      <div className="admin-body">

        <div className="admin-sidebar">

          <h3 className="menu-title">Menu</h3>

          <button
            className={`sidebar-btn ${active === "dashboard" ? "active" : ""}`}
            onClick={() => setActive("dashboard")}
          >
            🏠 Dashboard
          </button>

          <button
            className={`sidebar-btn ${active === "users" ? "active" : ""}`}
            onClick={() => fetchData("users")}
          >
            👤 Users
          </button>

          <button
            className={`sidebar-btn ${active === "organizers" ? "active" : ""}`}
            onClick={() => fetchData("organizers")}
          >
            🧑‍💼 Organizers
          </button>

          <button
            className={`sidebar-btn ${active === "events" ? "active" : ""}`}
            onClick={() => fetchData("events")}
          >
            📅 Events
          </button>

          <button
            className={`sidebar-btn ${active === "bookings" ? "active" : ""}`}
            onClick={() => fetchData("bookings")}
          >
            🎟 Bookings
          </button>

          <button
            className="sidebar-btn logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

        <div className="admin-content">

          <h2>Admin Dashboard</h2>
          {active === "dashboard" && (
            <div className="admin-cards">

              <div className="admin-card">
                <h3>Total Users</h3>
                <p>{counts.users}</p>
              </div>

              <div className="admin-card">
                <h3>Total Organizers</h3>
                <p>{counts.organizers}</p>
              </div>

              <div className="admin-card">
                <h3>Total Events</h3>
                <p>{counts.events}</p>
              </div>

              <div className="admin-card">
                <h3>Total Bookings</h3>
                <p>{counts.bookings}</p>
              </div>

            </div>
          )}
          {active !== "dashboard" && (
            <div className="admin-table-wrapper">

              {data.length === 0 ? (
                <p>No data available</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      {Object.keys(data[0])
                        .filter((key) => {
                          // Hide unwanted columns
                          if (active === "events" && key === "organizer") return false;
                          if (
                            active === "bookings" &&
                            (key === "user" || key === "email" || key === "event")
                          )
                            return false;
                          return true;
                        })
                        .map((key) => (
                          <th key={key}>{key}</th>
                        ))}

                      {active !== "bookings" && <th>Action</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id}>
                        {Object.entries(item)
                          .filter(([key]) => {
                            if (active === "events" && key === "organizer") return false;
                            if (
                              active === "bookings" &&
                              (key === "user" || key === "email" || key === "event")
                            )
                              return false;
                            return true;
                          })
                          .map(([key, value], index) => (
                            <td key={index}>
                              {typeof value === "object" ? "-" : value}
                            </td>
                          ))}

                        {active !== "bookings" && (
                          <td>
                            <button
                              className="deletes-btn"
                              onClick={() => deleteItem(active, item.id)}
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>

      </div>
      {openChat && (
        <div className="chat-popup">

          <div className="chat-header">
            <span>Organizer Messages</span>
            <button onClick={() => setOpenChat(false)}>X</button>
          </div>

          <div className="chat-users">

            {organizers.map(org => (
              <div
                key={org.id}
                className="chat-user"
                onClick={() => {
                  setSelectedUser(org.id);
                  loadMessages(org.id);
                }}
              >
                {org.name}
              </div>
            ))}

          </div>

          <div className="chat-body">

            {messages
              .filter(msg => msg.message)   // ignore empty rows
              .map((msg, index) => (
                <div
                 key={msg.id}
                  className={msg.senderId == senderId ? "my-message" : "other-message"}
                >
                  {msg.message}
                </div>
              ))}

          </div>

          {selectedUser && (
            <div className="chat-input">

              <input
                type="text"
                placeholder="Type message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />

              <button onClick={sendMessage}>Send</button>

            </div>
          )}

        </div>
      )}
    </div>
  );
}