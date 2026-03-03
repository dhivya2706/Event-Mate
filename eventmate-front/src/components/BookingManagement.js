import React, { useEffect, useState } from "react";
import styles from "../styles/BookingManagement.module.css";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/bookings");

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      setBookings(data);
      setError("");
    } catch (err) {
      setError("Error loading bookings");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CONFIRM
  const confirmBooking = async (id) => {
    if (!window.confirm("Confirm this booking?")) return;

    try {
      await fetch(`http://localhost:8080/api/bookings/confirm/${id}`, {
        method: "PUT",
      });

      await fetch(`http://localhost:8080/api/payment/confirm/${id}`, {
        method: "PUT",
      });

      // 🔥 Instant UI update (no delay)
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
  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await fetch(`http://localhost:8080/api/bookings/decline/${id}`, {
        method: "PUT",
      });

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

  if (loading)
    return <div className={styles.container}>Loading bookings...</div>;

  if (error)
    return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Booking & Attendee Management</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Event</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Booking Status</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8">No bookings available</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.userId}</td>
                  <td>{b.eventId || "N/A"}</td>
                  <td>{b.seatsBooked}</td>
                  <td>₹{b.totalAmount}</td>

                  <td
                    className={
                      b.bookingStatus === "Confirmed"
                        ? styles.statusConfirmed
                        : b.bookingStatus === "Cancelled"
                        ? styles.statusDeclined
                        : styles.statusPending
                    }
                  >
                    {b.bookingStatus}
                  </td>

                  <td
                    className={
                      b.paymentStatus === "Confirmed"
                        ? styles.statusConfirmed
                        : b.paymentStatus === "Cancelled"
                        ? styles.statusDeclined
                        : styles.statusPending
                    }
                  >
                    {b.paymentStatus}
                  </td>

                  <td>
                    <button
                      className={styles.confirmBtn}
                      onClick={() => confirmBooking(b.id)}
                      disabled={b.bookingStatus !== "Pending"}
                    >
                      ✔ Confirm
                    </button>

                    <button
                      className={styles.declineBtn}
                      onClick={() => cancelBooking(b.id)}
                      disabled={b.bookingStatus !== "Pending"}
                    >
                      ✘ Cancel
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;