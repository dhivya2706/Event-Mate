import React, { useState } from "react";
import axios from "axios";

function AddEvent() {

  const [form, setForm] = useState({
    eventName: "",
    eventDate: "",
    venue: "",
    vipSeats: "",
    vipPrice: "",
    premiumSeats: "",
    premiumPrice: "",
    regularSeats: "",
    regularPrice: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");

    if (!email) {
      alert("Login first!");
      return;
    }

    const data = new FormData();

    Object.keys(form).forEach(key => {
      data.append(key, form[key]);
    });

    data.append("email", email);

    try {
      await axios.post(
        "http://localhost:8080/api/events/add",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Event Added Successfully!");

      setForm({
        eventName: "",
        eventDate: "",
        venue: "",
        vipSeats: "",
        vipPrice: "",
        premiumSeats: "",
        premiumPrice: "",
        regularSeats: "",
        regularPrice: "",
        image: null
      });

    } catch (err) {
      console.log(err);
      alert("Error Adding Event");
    }
  };

  return (
    <div className="content-card">
      <h2 className="form-title">Add Event</h2>

      <form onSubmit={handleSubmit} className="event-form">

        <div className="form-group">
          <label>Event Title</label>
          <input name="eventName" value={form.eventName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Event Date</label>
          <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Venue</label>
          <input name="venue" value={form.venue} onChange={handleChange} required />
        </div>

        <h3 className="section-title">Seat Distribution</h3>

        <div className="seat-grid">
          <div className="form-group">
            <label>VIP Seats</label>
            <input type="number" name="vipSeats" value={form.vipSeats} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>VIP Price</label>
            <input type="number" name="vipPrice" value={form.vipPrice} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Premium Seats</label>
            <input type="number" name="premiumSeats" value={form.premiumSeats} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Premium Price</label>
            <input type="number" name="premiumPrice" value={form.premiumPrice} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Regular Seats</label>
            <input type="number" name="regularSeats" value={form.regularSeats} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Regular Price</label>
            <input type="number" name="regularPrice" value={form.regularPrice} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Event Image</label>
          <input type="file" name="image" onChange={handleChange} required />
        </div>

        <button type="submit" className="save-btn">Save Event</button>

      </form>
    </div>
  );
}

export default AddEvent;