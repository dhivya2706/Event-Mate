import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    venue: "",
    vipSeats: "",
    premiumSeats: "",
    regularSeats: "",
    vipPrice: "",
    premiumPrice: "",
    regularPrice: "",
    imageName: "",
  });

  const [newImage, setNewImage]     = useState(null);
  const [preview, setPreview]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/events/${id}`);
      setEventData({
        ...res.data,
        eventDate: res.data.eventDate ? res.data.eventDate.split("T")[0] : "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Fetch event error:", err);
      alert("Failed to load event details");
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvent(); }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setNewImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const totalSeats =
    Number(eventData.vipSeats || 0) +
    Number(eventData.premiumSeats || 0) +
    Number(eventData.regularSeats || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventData.eventName.trim()) { alert("Event name is required"); return; }
    if (totalSeats <= 0)             { alert("Total seats must be greater than 0"); return; }
    if (new Date(eventData.eventDate) < new Date()) { alert("Event date cannot be in the past"); return; }
    if (eventData.vipSeats < 0 || eventData.premiumSeats < 0 || eventData.regularSeats < 0) {
      alert("Seat counts cannot be negative"); return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("eventName",    eventData.eventName);
      formData.append("eventDate",    eventData.eventDate);
      formData.append("venue",        eventData.venue);
      formData.append("vipSeats",     eventData.vipSeats);
      formData.append("vipPrice",     eventData.vipPrice);
      formData.append("premiumSeats", eventData.premiumSeats);
      formData.append("premiumPrice", eventData.premiumPrice);
      formData.append("regularSeats", eventData.regularSeats);
      formData.append("regularPrice", eventData.regularPrice);
      if (newImage) formData.append("image", newImage);

      await axios.put(
        `http://localhost:8080/api/events/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Event updated successfully!");
      navigate("/organizer/manage-events");
    } catch (err) {
      console.error("Update event error:", err);
      alert("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading event details...</p>;

  const currentImageUrl = `http://localhost:8080/uploads/${eventData.imageName}`;

  return (
    <div className="form-card">
      <h2>Edit Event</h2>
      <p>Update your event details below</p>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Event Name</label>
          <input type="text" name="eventName" value={eventData.eventName} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Event Date</label>
            <input type="date" name="eventDate" value={eventData.eventDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input type="text" name="venue" value={eventData.venue} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Event Image</label>
          <div className="edit-img-wrap">
            <img
              src={preview || currentImageUrl}
              alt="Event"
              className="edit-img-preview"
              onError={e => { e.target.style.display = "none"; }}
            />
            {preview && (
              <span className="edit-img-new-badge">New Image</span>
            )}
          </div>
          <div className="edit-img-actions">
            <button
              type="button"
              className="edit-img-btn"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              📷 {preview ? "Change Image" : "Upload New Image"}
            </button>
            {preview && (
              <button type="button" className="edit-img-remove-btn" onClick={handleRemoveImage}>
                ✕ Keep Original
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <h3 style={{ color: "var(--text-primary)", fontSize: "16px", marginBottom: "16px", fontFamily: "'Playfair Display', serif" }}>
          Seat Distribution
        </h3>

        <div className="form-row">
          <div className="form-group">
            <label>VIP Seats</label>
            <input type="number" name="vipSeats" value={eventData.vipSeats} onChange={handleChange} min="0" required />
          </div>
          <div className="form-group">
            <label>VIP Price (₹)</label>
            <input type="number" name="vipPrice" value={eventData.vipPrice} onChange={handleChange} min="0" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Premium Seats</label>
            <input type="number" name="premiumSeats" value={eventData.premiumSeats} onChange={handleChange} min="0" required />
          </div>
          <div className="form-group">
            <label>Premium Price (₹)</label>
            <input type="number" name="premiumPrice" value={eventData.premiumPrice} onChange={handleChange} min="0" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Regular Seats</label>
            <input type="number" name="regularSeats" value={eventData.regularSeats} onChange={handleChange} min="0" required />
          </div>
          <div className="form-group">
            <label>Regular Price (₹)</label>
            <input type="number" name="regularPrice" value={eventData.regularPrice} onChange={handleChange} min="0" required />
          </div>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
          <strong style={{ color: "var(--gold)" }}>Total Seats: {totalSeats}</strong>
        </p>

        <button type="submit" className="form-submit-btn" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </form>
    </div>
  );
}

export default EditEvent;
