import React, { useEffect, useState } from "react";
import styles from "../styles/BookingManagement.module.css";

const BookingManagement = ({ goBack, user }) => {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    const res = await fetch(
      `http://localhost:8080/api/organizer/bookings?organizerId=${user.id}`
    );

    const data = await res.json();

    setBookings(data);
  };

  const confirmBooking = async (id) => {

    await fetch(
      `http://localhost:8080/api/organizer/booking/confirm/${id}`,
      { method: "PUT" }
    );

    fetchBookings();
  };

  const cancelBooking = async (id) => {

    await fetch(
      `http://localhost:8080/api/organizer/booking/cancel/${id}`,
      { method: "PUT" }
    );

    fetchBookings();
  };

  return (

    <div className={styles.container}>

      <button onClick={goBack}>← Back</button>

      <h2>Booking Management</h2>

      <table className={styles.table}>

        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Event</th>
            <th>Seats</th>
            <th>Amount</th>
            <th>Booking</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {bookings.map((b) => (

            <tr key={b.id}>

              <td>{b.id}</td>
              <td>{b.userId}</td>
              <td>{b.eventId}</td>
              <td>{b.seatsBooked}</td>
              <td>₹{b.totalAmount}</td>

              <td>{b.bookingStatus}</td>

              <td>{b.paymentStatus}</td>

              <td>

                <button
                  onClick={() => confirmBooking(b.id)}
                  disabled={b.bookingStatus !== "Pending"}
                >
                  Confirm
                </button>

                <button
                  onClick={() => cancelBooking(b.id)}
                  disabled={b.bookingStatus !== "Pending"}
                >
                  Cancel
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default BookingManagement;