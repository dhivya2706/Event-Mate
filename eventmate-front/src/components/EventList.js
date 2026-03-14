import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/EventList.module.css";

function EventList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const organizerId =
        JSON.parse(localStorage.getItem("user") || "{}")?.id;
      const url = organizerId
        ? `http://localhost:8080/api/organizer/events?organizerId=${organizerId}`
        : `http://localhost:8080/api/organizer/events`;
      const res = await axios.get(url);
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:8080/api/organizer/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert("Failed to delete event.");
    }
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setVenue(event.venue);
    setDate((event.eventDate || "").split("T")[0]);
    setCapacity(event.capacity);
    setPrice(event.price);
    setNewImage(null);
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedEvent) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("venue", venue);
      formData.append("event_date", date);
      formData.append("capacity", capacity);
      formData.append("price", price);
      if (newImage) formData.append("image", newImage);

      await axios.put(
        `http://localhost:8080/api/organizer/events/${selectedEvent.eventId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      fetchEvents();
      setEditModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      alert("Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className={styles.loadWrap}>
        <div className={styles.spinner} />
        <p>Loading events…</p>
      </div>
    );

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Manage Events</h2>
          <p className={styles.sub}>{events.length} event{events.length !== 1 ? "s" : ""} found</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => navigate("/organizer/add-event")}
        >
          + Add New Event
        </button>
      </div>

      {/* ── Empty state ── */}
      {events.length === 0 && (
        <div className={styles.emptyState}>
          <span>🎪</span>
          <p>No events yet. Create your first one!</p>
          <button
            className={styles.addBtn}
            onClick={() => navigate("/organizer/add-event")}
          >
            + Create Event
          </button>
        </div>
      )}

      {/* ── Grid ── */}
      <div className={styles.grid}>
        {events.map((event) => (
          <div key={event.eventId} className={styles.card}>

            {/* Image */}
            <div className={styles.imgWrap}>
              <img
                src={`http://localhost:8080/api/organizer/event-image/${event.eventId}`}
                alt={event.title}
                className={styles.img}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className={styles.imgFallback}>🖼 No Image</div>
            </div>

            {/* Info */}
            <div className={styles.cardBody}>
              <h3 className={styles.eventName}>{event.title}</h3>
              <p className={styles.meta}>📍 {event.venue}</p>
              <p className={styles.meta}>
                📅 {new Date(event.eventDate).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </p>
              <div className={styles.pills}>
                <span className={styles.pillSeats}>🪑 {event.capacity} seats</span>
                <span className={styles.pillPrice}>💰 ₹{Number(event.price).toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.cardFooter}>
              <button
                className={styles.editBtn}
                onClick={() => openEditModal(event)}
              >
                ✏️ Edit
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(event.eventId)}
              >
                🗑️ Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ── Edit Modal ── */}
      {editModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>

            {/* Modal header */}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Event</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setEditModalOpen(false)}
              >✕</button>
            </div>

            {/* Current image */}
            {selectedEvent && (
              <div className={styles.modalImgWrap}>
                <img
                  src={`http://localhost:8080/api/organizer/event-image/${selectedEvent.eventId}`}
                  alt="current"
                  className={styles.modalImg}
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}

            <div className={styles.modalForm}>
              {[
                { label: "Event Title", value: title, set: setTitle, type: "text" },
                { label: "Venue",       value: venue, set: setVenue, type: "text" },
                { label: "Date",        value: date,  set: setDate,  type: "date" },
                { label: "Capacity",    value: capacity, set: setCapacity, type: "number" },
                { label: "Price (₹)",   value: price, set: setPrice, type: "number" },
              ].map(({ label, value, set, type }) => (
                <div key={label} className={styles.fieldGroup}>
                  <label className={styles.label}>{label}</label>
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className={styles.input}
                  />
                </div>
              ))}

              <div className={styles.fieldGroup}>
                <label className={styles.label}>New Image (optional)</label>
                <label className={styles.fileLabel}>
                  <span>📁 Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImage(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </label>
                {newImage && (
                  <p className={styles.fileName}>✅ {newImage.name}</p>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.saveBtn}
                onClick={handleUpdate}
                disabled={saving}
              >
                {saving ? "Saving…" : "💾 Save Changes"}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setEditModalOpen(false)}
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

export default EventList;