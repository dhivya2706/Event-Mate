import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/AddEvent.module.css";

function AddEvent({ user, goBack }) {

  const [formData, setFormData] = useState({
    title: "",
    venue: "",
    event_date: "",
    capacity: "",
    price: "",
    image: null
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("venue", formData.venue);
    data.append("event_date", formData.event_date);
    data.append("capacity", formData.capacity);
    data.append("price", formData.price);
    data.append("image", formData.image);

    try {
      await axios.post(
        "http://localhost:8080/api/organizer/add-event",
        data
      );
      alert("Event Added Successfully");
      goBack(); // ✅ back to OrganizerHome after save
    } catch (error) {
      console.error(error);
      alert("Error adding event");
    }
  };

  return (
    <div className={styles.pageContainer}>

      {/* ✅ Back Button */}
      <button
        className={styles.backBtn}
        onClick={goBack}
      >
        ← Back
      </button>

      <div className={styles.eventForm}>
        <h2>Add New Event</h2>

        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Event Title" onChange={handleChange} required />
          <input type="text" name="venue" placeholder="Venue" onChange={handleChange} required />
          <input type="date" name="event_date" onChange={handleChange} required />
          <input type="number" name="capacity" placeholder="Total Seats" onChange={handleChange} required />
          <input type="number" name="price" placeholder="Ticket Price" onChange={handleChange} required />
          <input type="file" name="image" accept="image/*" onChange={handleChange} required />

          <button type="submit" className={styles.saveBtn}>
            Save Event
          </button>
        </form>
      </div>

    </div>
  );
}

export default AddEvent;