import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

function EditEvent() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [eventData, setEventData] = useState({
        eventName: "",
        totalSeats: "",
        date: "",
        location: "",
    });

    const [loading, setLoading] = useState(true);

    const fetchEvent = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/events/${id}`);
            setEventData(res.data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/events/${id}`, eventData);
            alert("Event updated successfully!");
            navigate("/organizer/manage-events"); // go back to manage events
        } catch (err) {
            console.error("Update event error:", err);
            alert("Failed to update event");
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
                    Total Seats:
                    <input
                        type="number"
                        name="totalSeats"
                        value={eventData.totalSeats}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Date:
                    <input
                        type="date"
                        name="date"
                        value={eventData.eventDate ? eventData.eventDate.split("T")[0] : ""}  // handle ISO date format
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Location:
                    <input
                        type="text"
                        name="venue"
                        value={eventData.venue}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" className="submit-btn">
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditEvent;