import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/events/${id}`
      );

      setEventData({
        ...res.data,
        eventDate: res.data.eventDate
          ? res.data.eventDate.split("T")[0]
          : "",
      });

      setLoading(false);
    } catch (err) {
      console.error("Fetch event error:", err);
      alert("Failed to load event details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const totalSeats =
    Number(eventData.vipSeats || 0) +
    Number(eventData.premiumSeats || 0) +
    Number(eventData.regularSeats || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventData.eventName.trim()) {
      alert("Event name is required");
      return;
    }

    if (totalSeats <= 0) {
      alert("Total seats must be greater than 0");
      return;
    }

    if (new Date(eventData.eventDate) < new Date()) {
      alert("Event date cannot be in the past");
      return;
    }

    if (
      eventData.vipSeats < 0 ||
      eventData.premiumSeats < 0 ||
      eventData.regularSeats < 0
    ) {
      alert("Seat counts cannot be negative");
      return;
    }

    try {
      setSaving(true);

      await axios.put(
        `http://localhost:8080/api/events/${id}`,
        {
          ...eventData,
          totalSeats,
        }
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

  return (
    <div className="content-card">
      <h1>Edit Event</h1>

      <form onSubmit={handleSubmit} className="event-form">

        <label>
          Event Name:
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Event Date:
          <input
            type="date"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Venue:
          <input
            type="text"
            name="venue"
            value={eventData.venue}
            onChange={handleChange}
            required
          />
        </label>

        <h3>Seat Distribution</h3>

        <label>
          VIP Seats:
          <input
            type="number"
            name="vipSeats"
            value={eventData.vipSeats}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <label>
          Premium Seats:
          <input
            type="number"
            name="premiumSeats"
            value={eventData.premiumSeats}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <label>
          Regular Seats:
          <input
            type="number"
            name="regularSeats"
            value={eventData.regularSeats}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <p><strong>Total Seats: {totalSeats}</strong></p>

        <h3>Seat Pricing</h3>

        <label>
          VIP Price:
          <input
            type="number"
            name="vipPrice"
            value={eventData.vipPrice}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <label>
          Premium Price:
          <input
            type="number"
            name="premiumPrice"
            value={eventData.premiumPrice}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <label>
          Regular Price:
          <input
            type="number"
            name="regularPrice"
            value={eventData.regularPrice}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <button
          type="submit"
          className="submit-btn"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditEvent;