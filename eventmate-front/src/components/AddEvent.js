import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../styles/AddEvent.module.css";

function AddEvent() {
  const navigate = useNavigate();

  // useOutletContext() can be null if Layout doesn't pass context on this route
  const context = useOutletContext() || {};
  const organizer = context.organizer || JSON.parse(localStorage.getItem("user") || "{}") || {};

  const [formData, setFormData] = useState({
    title: "",
    venue: "",
    event_date: "",
    capacity: "",
    price: "",
    image: null,
  });

  const [preview, setPreview] = useState(
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80"
  );

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("title",      formData.title);
    data.append("venue",      formData.venue);
    data.append("event_date", formData.event_date);
    data.append("capacity",   formData.capacity);
    data.append("price",      formData.price);
    data.append("image",      formData.image);
    data.append("organizerId", organizer?.id || "");

    try {
      await axios.post("http://localhost:8080/api/organizer/add-event", data);
      alert("Event Added Successfully!");
      navigate("/organizer");
    } catch (err) {
      console.error(err);
      alert("Error adding event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ── Header row ── */}
      <div className={styles.pageHeader}>
        <button className={styles.backBtn} onClick={() => navigate("/organizer")}>
          ← Back
        </button>
        <div>
          <h2 className={styles.pageTitle}>Create New Event</h2>
          <p className={styles.pageSubtitle}>Fill in the details to publish your event</p>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className={styles.formGrid}>

        {/* Left — Image preview */}
        <div className={styles.previewPanel}>
          <div className={styles.imageWrap}>
            <img src={preview} alt="Event poster" className={styles.previewImg} />
            <div className={styles.imageOverlay}>
              <span>🖼 Event Poster</span>
            </div>
          </div>
          <div className={styles.previewInfo}>
            <p className={styles.previewName}>{formData.title || "Event Title"}</p>
            <p className={styles.previewVenue}>{formData.venue ? `📍 ${formData.venue}` : "Venue will appear here"}</p>
            {formData.event_date && (
              <p className={styles.previewDate}>
                📅 {new Date(formData.event_date).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            )}
            {formData.price && <p className={styles.previewPrice}>💰 ₹{formData.price} / ticket</p>}
            {formData.capacity && <p className={styles.previewSeats}>🪑 {formData.capacity} seats</p>}
          </div>
        </div>

        {/* Right — Form */}
        <div className={styles.formPanel}>
          <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Event Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Summer Music Festival"
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Venue *</label>
              <input
                type="text"
                name="venue"
                placeholder="e.g. Chennai Trade Centre"
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Event Date *</label>
                <input
                  type="date"
                  name="event_date"
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Total Seats *</label>
                <input
                  type="number"
                  name="capacity"
                  placeholder="e.g. 500"
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Ticket Price (₹) *</label>
              <input
                type="number"
                name="price"
                placeholder="e.g. 999"
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Event Poster *</label>
              <label className={styles.fileLabel}>
                <span>📁 Choose Image</span>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className={styles.fileInput}
                />
              </label>
              {formData.image && (
                <p className={styles.fileName}>✅ {formData.image.name}</p>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting}
            >
              {submitting ? "Publishing…" : "🚀 Publish Event"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default AddEvent;