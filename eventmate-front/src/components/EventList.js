import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/EventList.module.css";

function EventList({ goBack }) {
  const [events, setEvents] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/organizer/events"
      );
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8080/api/organizer/events/${id}`);
        fetchEvents();
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setVenue(event.venue);
    setDate(event.eventDate.split("T")[0]); // yyyy-mm-dd
    setCapacity(event.capacity);
    setPrice(event.price);
    setNewImage(null);
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedEvent) return;
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
      console.error("Error updating event:", err);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={goBack}>
        ← Back
      </button>

      <h2 className={styles.title}>All Events</h2>

      <div className={styles.grid}>
        {events.map((event) => (
          <div key={event.eventId} className={styles.card}>
            {/* Event Image */}
            {event.image ? (
              <img
                src={`http://localhost:8080/api/organizer/event-image/${event.eventId}`}
                alt="event"
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder}>No Image</div>
            )}

            {/* Event Details */}
            <h3>{event.title}</h3>
            <p>{event.venue}</p>
            <p>{new Date(event.eventDate).toLocaleDateString()}</p>
            <p>Seats: {event.capacity}</p>
            <p>₹ {event.price}</p>

            {/* Buttons */}
            <div className={styles.buttonGroup}>
              <button
                className={styles.editBtn}
                onClick={() => openEditModal(event)}
              >
                Edit
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(event.eventId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Event</h2>

            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>Venue</label>
            <input value={venue} onChange={(e) => setVenue(e.target.value)} />

            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label>Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />

            <label>Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files[0])}
            />

            <div className={styles.modalButtons}>
              <button onClick={handleUpdate} className={styles.saveBtn}>
                Save
              </button>
              <button
                onClick={() => setEditModalOpen(false)}
                className={styles.cancelBtn}
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