import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from "../styles/Organizer.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#7c3aed","#6366f1","#06b6d4","#a78bfa","#34d399",
  "#f59e0b","#fb7185","#60a5fa","#f472b6","#4ade80",
];

function BookingMonitor() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    axios
      .get(`http://localhost:8080/api/organizer/bookings?organizerId=${user.id}`)
      .then((res) => {
        setBookings(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

  }, []);

  /* ===== Derived data ===== */

  const totalBookings = bookings.length;

  const totalRevenue = bookings.reduce(
    (s, b) => s + Number(b.totalAmount || 0),
    0
  );

  const totalSeats = bookings.reduce(
    (s, b) => s + Number(b.seatsBooked || 0),
    0
  );

  const grouped = bookings.reduce((acc, b) => {

    const id = b.eventId ?? "N/A";

    if (!acc[id]) {
      acc[id] = { revenue: 0, seats: 0 };
    }

    acc[id].revenue += Number(b.totalAmount || 0);
    acc[id].seats += Number(b.seatsBooked || 0);

    return acc;

  }, {});

  const eventIds = Object.keys(grouped);

  const revenueValues = eventIds.map((k) => grouped[k].revenue);

  const seatsValues = eventIds.map((k) => grouped[k].seats);

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const revenueChart = {
    labels: eventIds.map((id) => `Event ${id}`),
    datasets: [
      {
        data: revenueValues,
        backgroundColor: COLORS,
      },
    ],
  };

  const seatsChart = {
    labels: eventIds.map((id) => `Event ${id}`),
    datasets: [
      {
        data: seatsValues,
        backgroundColor: COLORS,
      },
    ],
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.page}>

      <h2>Booking Monitoring</h2>

      <div className={styles.statsRow}>

        <div className={styles.stat}>
          <h3>{totalBookings}</h3>
          <p>Total Bookings</p>
        </div>

        <div className={styles.stat}>
          <h3>₹{totalRevenue}</h3>
          <p>Total Revenue</p>
        </div>

        <div className={styles.stat}>
          <h3>{totalSeats}</h3>
          <p>Seats Booked</p>
        </div>

        <div className={styles.stat}>
          <h3>{eventIds.length}</h3>
          <p>Events</p>
        </div>

      </div>

      <div className={styles.splitRow}>

        <div className={styles.chartsCol}>

          <div className={styles.chartCard}>
            <h4>Revenue per Event</h4>
            <Doughnut data={revenueChart} options={donutOptions} />
          </div>

          <div className={styles.chartCard}>
            <h4>Seats per Event</h4>
            <Doughnut data={seatsChart} options={donutOptions} />
          </div>

        </div>

        <div className={styles.tableCol}>

          <h4>Booking Details</h4>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Event</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.eventId}</td>
                  <td>{b.seatsBooked}</td>
                  <td>₹{b.totalAmount}</td>
                  <td>
                    {new Date(b.bookingDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default BookingMonitor;