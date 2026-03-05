import React, { useEffect, useState } from "react";
import axios from "axios";

function OrganizerReminderPage() {

    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        loadReminders();
    }, []);

    const loadReminders = async () => {

        const res = await axios.get(
            "http://localhost:8080/api/organizer/reminders"
        );

        setReminders(res.data);
    };

   const sendReminder = async (id) => {

    await axios.post(
        `http://localhost:8080/api/organizer/sendReminder/${id}`
    );

    setReminders(prev =>
        prev.filter(r => r.bookingId !== id)
    );
};

    return (

        <div className="content-card">

            <h2>Event Reminder List</h2>

            <div className="reminder-grid">

                {reminders.map(r => (

                    <div className="reminder-card" key={r.bookingId}>

                        <h3>{r.userName}</h3>

                        <p>📧 {r.userEmail}</p>

                        <p>🎟 Event: {r.eventName}</p>

                        <p>📅 Date: {r.eventDate}</p>

                        <button onClick={() => sendReminder(r.bookingId)}>
                            Send Reminder
                        </button>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default OrganizerReminderPage;