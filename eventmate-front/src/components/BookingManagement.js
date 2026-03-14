import React, { useEffect, useState } from "react";
import styles from "../styles/BookingManagement.module.css";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const organizerId =
        JSON.parse(localStorage.getItem("user") || "{}")?.id;

      const url = organizerId
        ? `http://localhost:8080/api/organizer/bookings?organizerId=${organizerId}`
        : `http://localhost:8080/api/organizer/bookings`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/bookings/confirm/${id}`, { method: "PUT" });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, bookingStatus: "Confirmed" } : b))
      );
    } catch {
      alert("Failed to confirm booking");
    }
  };

  const cancelBooking = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/bookings/decline/${id}`, { method: "PUT" });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, bookingStatus: "Cancelled" } : b))
      );
    } catch {
      alert("Failed to cancel booking");
    }
  };

  const counts = {
    All: bookings.length,
    Pending: bookings.filter((b) => b.bookingStatus === "Pending").length,
    Confirmed: bookings.filter((b) => b.bookingStatus === "Confirmed").length,
    Cancelled: bookings.filter(
      (b) => b.bookingStatus === "Cancelled" || b.bookingStatus === "Declined"
    ).length,
  };

  const filtered =
    filter === "All"
      ? bookings
      : bookings.filter((b) =>
          filter === "Cancelled"
            ? b.bookingStatus === "Cancelled" || b.bookingStatus === "Declined"
            : b.bookingStatus === filter
        );

  const statusClass = (s) => {
    const v = (s || "").toLowerCase();
    if (v === "confirmed") return styles.confirmed;
    if (v === "cancelled" || v === "declined") return styles.cancelled;
    return styles.pending;
  };

  const payClass = (s) => {
    const v = (s || "").toLowerCase();
    if (v === "paid" || v === "confirmed") return styles.confirmed;
    return styles.pending;
  };

  if (loading)
    return (
      <div className={styles.loadWrap}>
        <div className={styles.spinner} />
        <p>Loading bookings…</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.loadWrap}>
        <p className={styles.errorMsg}>{error}</p>
      </div>
    );

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Booking Management</h2>
          <p className={styles.sub}>Review, confirm or cancel attendee bookings</p>
        </div>
      </div>

      {/* ── Stat pills ── */}
      <div className={styles.statsRow}>
        {[
          { label: "Total",     key: "All",       color: "#7c3aed" },
          { label: "Pending",   key: "Pending",   color: "#f59e0b" },
          { label: "Confirmed", key: "Confirmed", color: "#16a34a" },
          { label: "Cancelled", key: "Cancelled", color: "#dc2626" },
        ].map(({ label, key, color }) => (
          <button
            key={key}
            className={`${styles.statPill} ${filter === key ? styles.statActive : ""}`}
            style={{ "--pill-color": color }}
            onClick={() => setFilter(key)}
          >
            <span className={styles.statNum}>{counts[key]}</span>
            <span className={styles.statLabel}>{label}</span>
          </button>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className={styles.card}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <span>🎫</span>
            <p>No {filter !== "All" ? filter.toLowerCase() : ""} bookings found</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
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
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td className={styles.idCell}>{b.id}</td>
                    <td>{b.userId}</td>
                    <td>
                      <span className={styles.eventTag}>{b.eventId || "N/A"}</span>
                    </td>
                    <td>{b.seatsBooked}</td>
                    <td className={styles.amountCell}>₹{Number(b.totalAmount).toLocaleString()}</td>
                    <td>
                      <span className={`${styles.badge} ${statusClass(b.bookingStatus)}`}>
                        {b.bookingStatus || "Pending"}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${payClass(b.paymentStatus)}`}>
                        {b.paymentStatus || "Pending"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionRow}>
                        <button
                          className={styles.confirmBtn}
                          onClick={() => confirmBooking(b.id)}
                          disabled={b.bookingStatus !== "Pending"}
                        >
                          ✓ Confirm
                        </button>
                        <button
                          className={styles.cancelBtn}
                          onClick={() => cancelBooking(b.id)}
                          disabled={b.bookingStatus !== "Pending"}
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;