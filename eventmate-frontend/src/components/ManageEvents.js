import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function ManageEvents() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const email = localStorage.getItem("email");

            const res = await axios.get(
                `http://localhost:8080/api/events/organizer?email=${email}`
            );

            setEvents(res.data);
        } catch (err) {
            console.error("Fetch events error:", err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const deleteEvent = async (id) => {
        if (!window.confirm("Delete this event?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/events/${id}`);
            fetchEvents();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    return (
        <div className="content-card">
            <h1>Manage Events</h1>

            <div className="event-card-container">
                {events.length === 0 ? (
                    <p>No events created yet.</p>
                ) : (
                    events.map((e) => (
                        <div className="event-card" key={e.id}>
                            <h3>{e.eventName}</h3>

                            <p>Total Seats: {e.totalSeats}</p>

                            <div className="event-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => navigate(`edit/${e.id}`)} 
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => deleteEvent(e.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ManageEvents;