import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/QRCodeBooking.module.css";

function QRCodeBooking() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    axios
      .get(`http://localhost:8080/api/organizer/bookings?organizerId=${user.id}`)
      .then((res) => setBookings(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

  }, []);

  const confirmPayment = async (id) => {

    if (!window.confirm("Confirm payment via QR scan?")) return;

    try {

      await axios.put(`http://localhost:8080/api/organizer/payment/confirm/${id}`);

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, paymentStatus: "Confirmed" } : b
        )
      );

    } catch {
      alert("Payment confirmation failed");
    }

  };

  const counts = {
    All: bookings.length,
    Pending: bookings.filter((b) => b.paymentStatus !== "Confirmed").length,
    Confirmed: bookings.filter((b) => b.paymentStatus === "Confirmed").length,
  };

  const filtered =
    filter === "All"
      ? bookings
      : filter === "Confirmed"
      ? bookings.filter((b) => b.paymentStatus === "Confirmed")
      : bookings.filter((b) => b.paymentStatus !== "Confirmed");

  const badgeClass = (val) => {

    const v = (val || "").toLowerCase();

    if (v === "confirmed" || v === "paid") return styles.badgeGreen;
    if (v === "cancelled") return styles.badgeRed;

    return styles.badgeYellow;
  };

  if (loading) {
    return <div>Loading tickets...</div>;
  }

  return (
    <div className={styles.page}>

      <h2>QR Code Ticket Handling</h2>

      <div className={styles.statsRow}>

        <button onClick={() => setFilter("All")}>
          All ({counts.All})
        </button>

        <button onClick={() => setFilter("Pending")}>
          Pending ({counts.Pending})
        </button>

        <button onClick={() => setFilter("Confirmed")}>
          Verified ({counts.Confirmed})
        </button>

      </div>

      <div className={styles.card}>

        {filtered.length === 0 ? (
          <p>No tickets found</p>
        ) : (
          <table className={styles.table}>

            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Event</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Booking</th>
                <th>Payment</th>
                <th>QR Action</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map((b) => (

                <tr key={b.id}>

                  <td>{b.id}</td>
                  <td>{b.userId}</td>
                  <td>{b.eventId}</td>
                  <td>{b.seatsBooked}</td>
                  <td>₹{b.totalAmount}</td>
                  <td>
                    {new Date(b.bookingDate).toLocaleDateString()}
                  </td>

                  <td>
                    <span className={badgeClass(b.bookingStatus)}>
                      {b.bookingStatus}
                    </span>
                  </td>

                  <td>
                    <span className={badgeClass(b.paymentStatus)}>
                      {b.paymentStatus}
                    </span>
                  </td>

                  <td>

                    {b.paymentStatus === "Confirmed" ? (
                      <span>✓ Verified</span>
                    ) : (
                      <button onClick={() => confirmPayment(b.id)}>
                        Scan QR
                      </button>
                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

export default QRCodeBooking;