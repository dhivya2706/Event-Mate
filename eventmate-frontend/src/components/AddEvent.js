import React, { useState } from "react";
import axios from "axios";

function AddEvent() {

  const [form, setForm] = useState({
    eventName: "",
    eventDate: "",
    venue: "",
    ticketPrice: "",
    totalSeats: "",
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
    data.append("eventName", form.eventName);
    data.append("eventDate", form.eventDate);
    data.append("venue", form.venue);
    data.append("ticketPrice", form.ticketPrice);
    data.append("totalSeats", form.totalSeats);
    data.append("email", email);
    data.append("image", form.image);

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
        ticketPrice: "",
        totalSeats: "",
        image: null
      });

    } catch (err) {
      console.log(err);
      alert("Error Adding Event");
    }
  };

  return (
    <>
      <h2>Add Event</h2>

      <form onSubmit={handleSubmit} className="event-form">
        <input name="eventName" placeholder="Event Title" onChange={handleChange} required />
        <input name="eventDate" type="date" onChange={handleChange} required />
        <input name="venue" placeholder="Venue" onChange={handleChange} />
        <input name="ticketPrice" type="number" placeholder="Ticket Price" onChange={handleChange} />
        <input name="totalSeats" type="number" placeholder="Total Seats" onChange={handleChange} />
        <input type="file" name="image" onChange={handleChange} />
        <button type="submit" className="save-btn">Save</button>
      </form>
    </>
  );
}

export default AddEvent;