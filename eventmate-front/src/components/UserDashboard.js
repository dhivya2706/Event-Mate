import React, { useState, useEffect, useRef } from "react";
import "../styles/UserDashboard.css";
import Booking from "./Booking";
import Chatbot from "./Chatbot";

function UserDashboard({ currentUser }) {
  const [selectedEventData, setSelectedEventData] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);

  // ================= REMINDERS STATE =================
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem("eventReminders");
    return saved ? JSON.parse(saved) : [];
  });

  const [reminderForm, setReminderForm] = useState({
    eventId: "",
    eventTitle: "",
    reminderDate: "",
    reminderTime: "",
    note: "",
  });

  const [showReminderForm, setShowReminderForm] = useState(false);

  // ================= TOAST NOTIFICATIONS =================
  const [toasts, setToasts] = useState([]);
  const checkedRef = useRef(new Set());

  const loggedUser = currentUser || JSON.parse(localStorage.getItem("user"));

  const username =
    loggedUser?.name ||
    localStorage.getItem("adminName") ||
    loggedUser?.email?.split("@")[0] ||
    "User";

  const [profile, setProfile] = useState({
    name: loggedUser?.name || "",
    email: loggedUser?.email || localStorage.getItem("adminEmail") || "",
  });

  // ================= USER ID HELPER =================
  const getUserId = () =>
    loggedUser?.id ||
    localStorage.getItem("adminId") ||
    JSON.parse(localStorage.getItem("user") || "{}")?.id;

  // ================= FETCH EVENTS =================
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/events");
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  // ================= FETCH BOOKINGS (USER) =================
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    fetch(`http://localhost:8080/api/bookings/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Booking fetch error:", err);
        setBookings([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser]);

  // ================= AUTO SLIDER =================
  useEffect(() => {
    if (!events.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [events]);

  // ================= SAVE REMINDERS =================
  useEffect(() => {
    localStorage.setItem("eventReminders", JSON.stringify(reminders));
  }, [reminders]);

  // ================= REAL-TIME REMINDER CHECKER (every 30s) =================
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const nowDate = now.toISOString().split("T")[0];

      reminders.forEach((r) => {
        if (r.dismissed) return;
        if (checkedRef.current.has(r.id)) return;
        if (!r.reminderDate || !r.reminderTime) return;

        const isDateMatch = r.reminderDate === nowDate;

        const [rHH, rMM] = r.reminderTime.split(":").map(Number);
        const reminderMinutes = rHH * 60 + rMM;

        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const withinWindow =
          nowMinutes >= reminderMinutes && nowMinutes <= reminderMinutes + 2;

        if (isDateMatch && withinWindow) {
          checkedRef.current.add(r.id);
          showToast(r);

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`🔔 EventMate Reminder`, {
              body: `${r.eventTitle}${r.note ? " — " + r.note : ""}`,
              icon: "/favicon.ico",
            });
          }
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [reminders]);

  // ================= REQUEST BROWSER NOTIFICATION PERMISSION =================
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // ================= TOAST HELPERS =================
  const showToast = (reminder) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, reminder }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 10000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ================= DATE HELPERS =================
  const extractDateString = (eventDate) => {
    if (!eventDate) return null;
    if (Array.isArray(eventDate)) {
      const [year, month, day] = eventDate;
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
    }
    if (typeof eventDate === "string") return eventDate.split("T")[0];
    return null;
  };

  const formatDisplayDate = (eventDate) => {
    const dateStr = extractDateString(eventDate);
    if (!dateStr) return "Date TBD";
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date, time) => {
    if (!date) return "—";
    const d = new Date(`${date}T${time || "00:00"}:00`);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatBookingDate = (dt) => {
    if (!dt) return "—";
    const safe = String(dt).replace(" ", "T");
    const d = new Date(safe);
    if (Number.isNaN(d.getTime())) return String(dt);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const today = new Date().toISOString().split("T")[0];

  // ================= DATE FILTER =================
  useEffect(() => {
    if (!selectedDate) {
      setFilteredEvents([]);
      return;
    }
    const filtered = events.filter(
      (event) => extractDateString(event.eventDate) === selectedDate
    );
    setFilteredEvents(filtered);
  }, [selectedDate, events]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // ================= PROFILE SAVE =================
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: "", error: false });

  const handleProfileSave = async () => {
    const userId = getUserId();

    if (!userId) {
      setProfileMsg({
        text: "❌ User ID not found. Please log out and log in again.",
        error: true,
      });
      return;
    }

    if (!profile.name.trim()) {
      setProfileMsg({ text: "❌ Name cannot be empty.", error: true });
      return;
    }

    setProfileSaving(true);
    setProfileMsg({ text: "", error: false });

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: profile.name.trim() }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setProfileMsg({
          text: `❌ ${err.error || "Update failed. Try again."}`,
          error: true,
        });
        setProfileSaving(false);
        return;
      }

      const result = await response.json();

      const updatedUser = {
        ...loggedUser,
        id: userId,
        name: result.name || profile.name,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("adminName", updatedUser.name);
      localStorage.setItem("adminId", userId);

      setProfileMsg({ text: "✅ Profile updated!", error: false });
      setTimeout(() => {
        setShowProfile(false);
        setProfileMsg({ text: "", error: false });
        window.location.reload();
      }, 900);
    } catch (err) {
      console.error("Profile update error:", err);
      setProfileMsg({ text: "❌ Cannot connect to server.", error: true });
    }

    setProfileSaving(false);
  };

  // ================= BOOK NOW =================
  const handleBookNow = (event) => {
    setSelectedEventData({ ...event, eventId: event.eventId || event.event_id });
    setActivePage("bookings");
  };

  // ================= REMINDER HANDLERS =================
  const openReminderForm = (event) => {
    setReminderForm({
      eventId: event.eventId,
      eventTitle: event.title,
      reminderDate: "",
      reminderTime: "",
      note: "",
    });
    setShowReminderForm(true);
  };

  const saveReminder = () => {
    if (!reminderForm.reminderDate || !reminderForm.reminderTime) {
      alert("Please select both a date and time for the reminder.");
      return;
    }
    const newReminder = {
      id: Date.now(),
      ...reminderForm,
      dismissed: false,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [newReminder, ...prev]);
    setShowReminderForm(false);
    setReminderForm({
      eventId: "",
      eventTitle: "",
      reminderDate: "",
      reminderTime: "",
      note: "",
    });
  };

  const deleteReminder = (id) =>
    setReminders((prev) => prev.filter((r) => r.id !== id));

  const dismissReminder = (id) =>
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, dismissed: true } : r))
    );

  const getReminderStatus = (reminderDate, reminderTime) => {
    const reminderDT = new Date(`${reminderDate}T${reminderTime}:00`);
    const now = new Date();
    const diffMs = reminderDT - now;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 0)
      return { label: "Overdue", color: "#ef4444", bg: "#fef2f2" };
    if (diffMins < 60)
      return { label: `In ${diffMins} min`, color: "#f59e0b", bg: "#fffbeb" };
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return { label: `In ${diffHours}h`, color: "#8b5cf6", bg: "#f5f3ff" };
    const diffDays = Math.ceil(diffMins / (60 * 24));
    return { label: `In ${diffDays} days`, color: "#10b981", bg: "#f0fdf4" };
  };

  // ================= BOOKINGS UI HELPERS =================
  const getBadge = (value, kind) => {
    const v = (value || "").toLowerCase();
    if (kind === "booking") {
      if (v === "confirmed")
        return { bg: "#16a34a", text: "#fff", label: value };
      if (v === "cancelled" || v === "canceled")
        return { bg: "#dc2626", text: "#fff", label: value };
      return { bg: "#f59e0b", text: "#fff", label: value || "Pending" };
    }
    // payment
    if (v === "confirmed" || v === "paid")
      return { bg: "#16a34a", text: "#fff", label: value };
    return { bg: "#f59e0b", text: "#fff", label: value || "Pending" };
  };

  const eventTitleById = (eventId) => {
    const e = events.find((x) => x.eventId === eventId || x.event_id === eventId);
    return e?.title || "Event";
  };

  const confirmedCount = bookings.filter(
    (b) => (b.bookingStatus || "").toLowerCase() === "confirmed"
  ).length;

  const cancelledCount = bookings.filter((b) => {
    const s = (b.bookingStatus || "").toLowerCase();
    return s === "cancelled" || s === "canceled";
  }).length;

  const pendingCount = bookings.filter(
    (b) => (b.bookingStatus || "").toLowerCase() === "pending"
  ).length;

  // ================= UI VALUES =================
  const eventsToShow = selectedDate ? filteredEvents : events;
  const activeReminders = reminders.filter((r) => !r.dismissed);
  const dueToday = reminders.filter((r) => r.reminderDate === today && !r.dismissed);

  const eventCardStyle = {
    background: "#ffffff",
    border: "1px solid #e0d4ff",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 4px 14px rgba(124,58,237,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#111827",
  };

  return (
    <div className="user-dashboard">
      {/* ===================== TOAST NOTIFICATIONS ===================== */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "360px",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "18px 20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              border: "2px solid #f59e0b",
              animation: "slideInRight 0.4s cubic-bezier(0.22,1,0.36,1)",
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
            }}
          >
            <div style={{ fontSize: "28px", lineHeight: 1 }}>🔔</div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#92400e",
                }}
              >
                Reminder!
              </p>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#111827",
                }}
              >
                {toast.reminder.eventTitle}
              </p>
              {toast.reminder.note && (
                <p style={{ margin: "0 0 6px 0", fontSize: "13px", color: "#6b7280" }}>
                  📝 {toast.reminder.note}
                </p>
              )}
              <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                ⏰ {formatDateTime(toast.reminder.reminderDate, toast.reminder.reminderTime)}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                color: "#9ca3af",
                padding: "0",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes popupFade {
          from { opacity: 0; transform: translateY(-16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="app-shell">
        {/* HEADER */}
        <header className="app-header">
          <div className="brand">EVENTMATE <span>AI</span></div>
          <div className="header-right">
            {dueToday.length > 0 && (
              <button
                onClick={() => setActivePage("reminders")}
                style={{
                  background: "#fef3c7",
                  border: "1px solid #fcd34d",
                  borderRadius: "999px",
                  padding: "6px 14px",
                  marginRight: "10px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#92400e",
                }}
              >
                🔔 {dueToday.length} due today
              </button>
            )}
            <button className="profile-pill" onClick={() => setShowProfile(true)}>
              👤 {username}
            </button>
          </div>
        </header>

        <div className="app-main">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <h3>Menu</h3>

            <button
              className={`nav-btn ${activePage === "home" ? "active" : ""}`}
              onClick={() => setActivePage("home")}
            >
              🏠 Home
            </button>

            <button
              className={`nav-btn ${activePage === "events" ? "active" : ""}`}
              onClick={() => setActivePage("events")}
            >
              📅 Browse Events
            </button>

            <button
              className={`nav-btn ${activePage === "bookings" ? "active" : ""}`}
              onClick={() => setActivePage("bookings")}
            >
              🎫 My Bookings
            </button>

            {/* ✅ NEW: Booking History separate */}
            <button
              className={`nav-btn ${activePage === "bookingHistory" ? "active" : ""}`}
              onClick={() => setActivePage("bookingHistory")}
            >
              📜 Booking History
            </button>

            <button
              className={`nav-btn ${activePage === "reminders" ? "active" : ""}`}
              onClick={() => setActivePage("reminders")}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <span>🔔 Reminders</span>
              {activeReminders.length > 0 && (
                <span
                  style={{
                    background: "#f59e0b",
                    color: "#fff",
                    borderRadius: "999px",
                    fontSize: "11px",
                    padding: "2px 8px",
                    fontWeight: 700,
                  }}
                >
                  {activeReminders.length}
                </span>
              )}
            </button>

            <button
              className={`nav-btn ${activePage === "chatbot" ? "active" : ""}`}
              onClick={() => setActivePage("chatbot")}
            >
              🤖 AI Assistant
            </button>

            <button className="nav-btn logout-side" onClick={handleLogout}>
              🚪 Logout
            </button>
          </aside>

          {/* MAIN CONTENT */}
          <section className="main-content">
            {/* HOME */}
            {activePage === "home" && (
              <div className="content-card">
                <h2>Welcome, {username}! 👋</h2>

                {/* ✅ COUNTS (Attractive cards) */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "16px",
                    marginTop: "18px",
                  }}
                >
                  <div
                    style={{
                      background: "#ecfdf5",
                      border: "1px solid #bbf7d0",
                      padding: "16px",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <h3 style={{ color: "#16a34a", fontSize: "22px", margin: 0 }}>
                      {confirmedCount}
                    </h3>
                    <p style={{ margin: "6px 0 0 0", fontWeight: 600, color: "#065f46" }}>
                      Confirmed
                    </p>
                  </div>

                  <div
                    style={{
                      background: "#fff7ed",
                      border: "1px solid #fed7aa",
                      padding: "16px",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <h3 style={{ color: "#f59e0b", fontSize: "22px", margin: 0 }}>
                      {pendingCount}
                    </h3>
                    <p style={{ margin: "6px 0 0 0", fontWeight: 600, color: "#9a3412" }}>
                      Pending
                    </p>
                  </div>

                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      padding: "16px",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <h3 style={{ color: "#dc2626", fontSize: "22px", margin: 0 }}>
                      {cancelledCount}
                    </h3>
                    <p style={{ margin: "6px 0 0 0", fontWeight: 600, color: "#7f1d1d" }}>
                      Cancelled
                    </p>
                  </div>
                </div>

                {/* Reminders banner */}
                {dueToday.length > 0 && (
                  <div
                    style={{
                      background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
                      border: "1px solid #fcd34d",
                      borderRadius: "12px",
                      padding: "14px 18px",
                      marginTop: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#92400e", fontSize: "14px" }}>
                      🔔 {dueToday.length} reminder(s) due today!
                    </span>
                    <button
                      onClick={() => setActivePage("reminders")}
                      style={{
                        background: "#f59e0b",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 14px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      View
                    </button>
                  </div>
                )}

                {/* Slider */}
                {events.length > 0 && events[currentIndex] && (
                  <div className="slider-container" style={{ marginTop: "18px" }}>
                    <img
                      src={
                        events[currentIndex]?.image
                          ? `data:image/jpeg;base64,${events[currentIndex].image}`
                          : "https://via.placeholder.com/600x300?text=Event"
                      }
                      alt={events[currentIndex]?.title || "Event"}
                      className="slider-image"
                    />
                    <div className="slider-overlay">
                      <h1>{events[currentIndex]?.title}</h1>
                      <p>📍 {events[currentIndex]?.venue}</p>
                      <p>🪑 Seats: {events[currentIndex]?.capacity}</p>
                      <p>💰 Price: ₹{events[currentIndex]?.price}</p>
                      <button className="live-btn" onClick={() => handleBookNow(events[currentIndex])}>
                        Book Now
                      </button>
                    </div>
                  </div>
                )}

                {events.length === 0 && (
                  <p style={{ color: "#888", marginTop: "20px" }}>
                    No upcoming events available.
                  </p>
                )}
              </div>
            )}

            {/* EVENTS */}
            {activePage === "events" && (
              <div className="content-card">
                <h2>Browse Events</h2>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="date-input"
                  />
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate("")}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#444",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "18px",
                    marginTop: "10px",
                  }}
                >
                  {eventsToShow.length > 0 ? (
                    eventsToShow.map((event) => (
                      <div key={event.eventId} style={eventCardStyle}>
                        <img
                          src={
                            event?.image
                              ? `data:image/jpeg;base64,${event.image}`
                              : "https://via.placeholder.com/300x180?text=Event"
                          }
                          alt={event?.title || "Event"}
                          style={{
                            width: "100%",
                            height: "170px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            display: "block",
                          }}
                        />
                        <h3
                          style={{
                            color: "#111827",
                            fontWeight: 700,
                            margin: "4px 0 0 0",
                            fontSize: "1rem",
                          }}
                        >
                          {event?.title}
                        </h3>
                        <p style={{ color: "#374151", margin: 0, fontSize: "0.875rem" }}>
                          📍 {event?.venue}
                        </p>
                        <p style={{ color: "#374151", margin: 0, fontSize: "0.875rem" }}>
                          📅 {formatDisplayDate(event?.eventDate)}
                        </p>
                        <p style={{ color: "#374151", margin: 0, fontSize: "0.875rem" }}>
                          🪑 Seats: {event?.capacity}
                        </p>
                        <p style={{ color: "#374151", margin: 0, fontSize: "0.875rem" }}>
                          💰 Price: ₹{event?.price}
                        </p>

                        <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                          <button
                            onClick={() => handleBookNow(event)}
                            style={{
                              flex: 1,
                              padding: "10px",
                              borderRadius: "8px",
                              border: "none",
                              background: "linear-gradient(90deg,#7c3aed,#06b6d4)",
                              color: "white",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            Book Now
                          </button>

                          <button
                            onClick={() => openReminderForm(event)}
                            style={{
                              padding: "10px 12px",
                              borderRadius: "8px",
                              border: "1px solid #e0d4ff",
                              background: "#faf5ff",
                              color: "#7c3aed",
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: "16px",
                            }}
                            title="Set Reminder"
                          >
                            🔔
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ marginTop: "10px", color: "#dc2626", fontWeight: 500 }}>
                      {selectedDate ? `No events found on ${selectedDate}.` : "No events available."}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* BOOKINGS */}
            {activePage === "bookings" && (
              <Booking selectedEventData={selectedEventData} currentUser={loggedUser} />
            )}

            {/* ✅ BOOKING HISTORY (SEPARATE PAGE) */}
            {activePage === "bookingHistory" && (
              <div className="content-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                  <h2 style={{ margin: 0 }}>📜 Booking History</h2>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>
                    Total: {bookings.length}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "12px",
                    marginTop: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ background: "#ecfdf5", border: "1px solid #bbf7d0", padding: "12px", borderRadius: "12px" }}>
                    <div style={{ fontWeight: 800, color: "#16a34a", fontSize: "18px" }}>{confirmedCount}</div>
                    <div style={{ color: "#065f46", fontWeight: 600, fontSize: "12px" }}>Confirmed</div>
                  </div>
                  <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", padding: "12px", borderRadius: "12px" }}>
                    <div style={{ fontWeight: 800, color: "#f59e0b", fontSize: "18px" }}>{pendingCount}</div>
                    <div style={{ color: "#9a3412", fontWeight: 600, fontSize: "12px" }}>Pending</div>
                  </div>
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "12px", borderRadius: "12px" }}>
                    <div style={{ fontWeight: 800, color: "#dc2626", fontSize: "18px" }}>{cancelledCount}</div>
                    <div style={{ color: "#7f1d1d", fontWeight: 600, fontSize: "12px" }}>Cancelled</div>
                  </div>
                </div>

                {bookings.length === 0 ? (
                  <p style={{ color: "#888", marginTop: "10px" }}>No bookings yet.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "#fff",
                        borderRadius: "10px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        marginTop: "10px",
                      }}
                    >
                      <thead style={{ background: "#7c3aed", color: "#fff" }}>
                        <tr>
                          <th style={{ padding: "10px", textAlign: "left" }}>Event</th>
                          <th style={{ padding: "10px", textAlign: "left" }}>Seats</th>
                          <th style={{ padding: "10px", textAlign: "left" }}>Total</th>
                          <th style={{ padding: "10px", textAlign: "left" }}>Booking</th>
                          <th style={{ padding: "10px", textAlign: "left" }}>Payment</th>
                          <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {bookings.map((b) => {
                          const bookingBadge = getBadge(b.bookingStatus, "booking");
                          const payBadge = getBadge(b.paymentStatus, "payment");

                          return (
                            <tr key={b.id} style={{ borderBottom: "1px solid #eee" }}>
                              <td style={{ padding: "10px", fontWeight: 700, color: "#111827" }}>
                                {eventTitleById(b.eventId)}
                                <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600 }}>
                                  {b.eventId}
                                </div>
                              </td>

                              <td style={{ padding: "10px" }}>{b.seats || "-"}</td>
                              <td style={{ padding: "10px" }}>₹{b.totalAmount}</td>

                              <td style={{ padding: "10px" }}>
                                <span
                                  style={{
                                    background: bookingBadge.bg,
                                    color: bookingBadge.text,
                                    padding: "4px 10px",
                                    borderRadius: "999px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                  }}
                                >
                                  {bookingBadge.label}
                                </span>
                              </td>

                              <td style={{ padding: "10px" }}>
                                <span
                                  style={{
                                    background: payBadge.bg,
                                    color: payBadge.text,
                                    padding: "4px 10px",
                                    borderRadius: "999px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                  }}
                                >
                                  {payBadge.label}
                                </span>
                              </td>

                              <td style={{ padding: "10px", color: "#6b7280", fontWeight: 600 }}>
                                {formatBookingDate(b.bookingDate)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* REMINDERS */}
            {activePage === "reminders" && (
              <div className="content-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ margin: 0 }}>🔔 My Reminders</h2>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>{activeReminders.length} active</span>
                </div>

                {dueToday.length > 0 && (
                  <div
                    style={{
                      background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
                      border: "1px solid #fcd34d",
                      borderRadius: "12px",
                      padding: "14px 18px",
                      marginBottom: "20px",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 700, color: "#92400e", fontSize: "15px" }}>
                      ⚡ {dueToday.length} reminder(s) due today — check your notifications!
                    </p>
                  </div>
                )}

                {/* Quick set */}
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontWeight: 600, color: "#374151", marginBottom: "12px", fontSize: "14px" }}>
                    Set a reminder for an upcoming event:
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
                    {events.map((event) => (
                      <div
                        key={event.eventId}
                        style={{
                          background: "#f5f3ff",
                          border: "1px solid #e0d4ff",
                          borderRadius: "12px",
                          padding: "14px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: "13px", color: "#111827" }}>
                            {event.title}
                          </p>
                          <p style={{ margin: "3px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
                            {formatDisplayDate(event.eventDate)}
                          </p>
                        </div>
                        <button
                          onClick={() => openReminderForm(event)}
                          style={{
                            padding: "7px 12px",
                            borderRadius: "8px",
                            border: "none",
                            background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          + Set
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* List */}
                {reminders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔕</div>
                    <p style={{ fontWeight: 600, fontSize: "16px" }}>No reminders yet</p>
                    <p style={{ fontSize: "13px" }}>Click "+ Set" or the 🔔 on any event card</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <p style={{ fontWeight: 600, color: "#374151", fontSize: "14px", marginBottom: "4px" }}>
                      Your Reminders:
                    </p>

                    {reminders.map((reminder) => {
                      const status = reminder.dismissed
                        ? { label: "Dismissed", color: "#9ca3af", bg: "#f9fafb" }
                        : getReminderStatus(reminder.reminderDate, reminder.reminderTime);

                      return (
                        <div
                          key={reminder.id}
                          style={{
                            background: reminder.dismissed ? "#f9fafb" : "#fff",
                            border: `1px solid ${status.bg}`,
                            borderLeft: `4px solid ${status.color}`,
                            borderRadius: "12px",
                            padding: "16px 18px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            opacity: reminder.dismissed ? 0.55 : 1,
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                              <p style={{ margin: 0, fontWeight: 700, color: "#111827", fontSize: "15px" }}>
                                {reminder.eventTitle}
                              </p>
                              <span style={{ background: status.bg, color: status.color, borderRadius: "999px", fontSize: "11px", padding: "3px 10px", fontWeight: 700 }}>
                                {status.label}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                              ⏰ <strong>{formatDateTime(reminder.reminderDate, reminder.reminderTime)}</strong>
                            </p>
                            {reminder.note && (
                              <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#374151", background: "#f5f3ff", padding: "6px 10px", borderRadius: "6px", display: "inline-block" }}>
                                📝 {reminder.note}
                              </p>
                            )}
                          </div>

                          <div style={{ display: "flex", gap: "8px", marginLeft: "12px" }}>
                            {!reminder.dismissed && (
                              <button
                                onClick={() => dismissReminder(reminder.id)}
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: "8px",
                                  border: "1px solid #e5e7eb",
                                  background: "#f9fafb",
                                  color: "#6b7280",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                }}
                              >
                                ✓ Done
                              </button>
                            )}
                            <button
                              onClick={() => deleteReminder(reminder.id)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                border: "1px solid #fecaca",
                                background: "#fef2f2",
                                color: "#ef4444",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: 600,
                              }}
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* CHATBOT */}
            {activePage === "chatbot" && (
              <div className="content-card">
                <h2>AI Assistant</h2>
                <p style={{ marginBottom: "20px", color: "#888" }}>
                  Ask me anything about your events or bookings!
                </p>
                <Chatbot currentUser={loggedUser} />
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ================= REMINDER FORM MODAL ================= */}
      {showReminderForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "36px",
              width: "100%",
              maxWidth: "420px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              animation: "popupFade 0.3s ease",
            }}
          >
            <h3 style={{ margin: 0, color: "#111827", fontSize: "18px", fontWeight: 700 }}>
              🔔 Set Reminder
            </h3>

            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              Event: <strong style={{ color: "#7c3aed" }}>{reminderForm.eventTitle}</strong>
            </p>

            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                📅 Remind Date *
              </label>
              <input
                type="date"
                min={today}
                value={reminderForm.reminderDate}
                onChange={(e) => setReminderForm({ ...reminderForm, reminderDate: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #e5e7eb",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                ⏰ Remind Time *
              </label>
              <input
                type="time"
                value={reminderForm.reminderTime}
                onChange={(e) => setReminderForm({ ...reminderForm, reminderTime: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #e5e7eb",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                📝 Note (optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Book tickets before they run out!"
                value={reminderForm.note}
                onChange={(e) => setReminderForm({ ...reminderForm, note: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #e5e7eb",
                  fontSize: "14px",
                  outline: "none",
                  resize: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {reminderForm.reminderDate && reminderForm.reminderTime && (
              <div
                style={{
                  background: "#f5f3ff",
                  border: "1px solid #e0d4ff",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  color: "#7c3aed",
                  fontWeight: 600,
                }}
              >
                ✅ You'll be reminded on: {formatDateTime(reminderForm.reminderDate, reminderForm.reminderTime)}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={saveReminder}
                style={{
                  flex: 1,
                  padding: "13px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Save Reminder
              </button>

              <button
                onClick={() => setShowReminderForm(false)}
                style={{
                  flex: 1,
                  padding: "13px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  color: "#374151",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PROFILE MODAL ================= */}
      {showProfile && (
        <div className="profile-modal">
          <div className="profile-card">
            <h3>👤 User Profile</h3>

            <input
              type="text"
              placeholder="Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />

            <input
              type="email"
              value={profile.email}
              disabled
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            />

            {profileMsg.text && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textAlign: "center",
                  background: profileMsg.error ? "#fef2f2" : "#f0fdf4",
                  color: profileMsg.error ? "#dc2626" : "#16a34a",
                  border: `1px solid ${profileMsg.error ? "#fecaca" : "#bbf7d0"}`,
                }}
              >
                {profileMsg.text}
              </div>
            )}

            <div className="profile-actions">
              <button
                onClick={handleProfileSave}
                disabled={profileSaving}
                style={{
                  opacity: profileSaving ? 0.7 : 1,
                  cursor: profileSaving ? "not-allowed" : "pointer",
                }}
              >
                {profileSaving ? "Saving…" : "Save"}
              </button>

              <button
                onClick={() => {
                  setShowProfile(false);
                  setProfileMsg({ text: "", error: false });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;