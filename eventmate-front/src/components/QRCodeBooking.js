import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/QRCodeBooking.module.css";

function QRCodeBooking({ goBack }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // ✅ CONFIRM
  const handleConfirm = async (id) => {
    if (!window.confirm("Confirm this booking?")) return;

    try {
      await axios.put(`http://localhost:8080/api/bookings/confirm/${id}`);
      await axios.put(`http://localhost:8080/api/payment/confirm/${id}`);

      // 🔥 Update UI immediately
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, bookingStatus: "Confirmed", paymentStatus: "Confirmed" }
            : b
        )
      );

    } catch (err) {
      alert("Failed to confirm booking");
    }
  };

  // ✅ CANCEL
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await axios.put(`http://localhost:8080/api/bookings/decline/${id}`);

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, bookingStatus: "Cancelled", paymentStatus: "Cancelled" }
            : b
        )
      );

    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  const statusColor = (val) =>
    val === "Confirmed"
      ? "green"
      : val === "Cancelled"
      ? "red"
      : "orange";

  return (
    <div className={styles.container}>
      <h1>QR Code Ticket Handling</h1>
      <button className={styles.backBtn} onClick={goBack}>
        ← Back
      </button>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Event ID</th>
              <th>Seats</th>
              <th>Total</th>
              <th>Date</th>
              <th>Booking Status</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.userId}</td>
                <td>{b.eventId || "N/A"}</td>
                <td>{b.seats}</td>
                <td>₹{b.totalAmount}</td>
                <td>{new Date(b.bookingDate).toLocaleString()}</td>

                <td style={{ color: statusColor(b.bookingStatus), fontWeight: "bold" }}>
                  {b.bookingStatus}
                </td>

                <td style={{ color: statusColor(b.paymentStatus), fontWeight: "bold" }}>
                  {b.paymentStatus}
                </td>

                <td>
                  <button
                    className={styles.confirmBtn}
                    onClick={() => handleConfirm(b.id)}
                    disabled={b.bookingStatus !== "Pending"}
                  >
                    ✔ Confirm
                  </button>

                  <button
                    className={styles.declineBtn}
                    onClick={() => handleCancel(b.id)}
                    disabled={b.bookingStatus !== "Pending"}
                  >
                    ✘ Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QRCodeBooking;