import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import styles from "../styles/Organizer.module.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function OrganizerDashboard() {

  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // 🔥 FETCH DATA FROM BACKEND
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/organizer/bookings");
      setBookings(res.data);

      // calculate totals
      setTotalBookings(res.data.length);

      const revenue = res.data.reduce((sum, b) => sum + Number(b.totalAmount), 0);
      setTotalRevenue(revenue);

    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // Grouping logic
  const grouped = bookings.reduce((acc, b) => {
    const id = b.eventId ?? "N/A";
    if (!acc[id]) acc[id] = { revenue: 0, seats: 0 };
    acc[id].revenue += Number(b.totalAmount);
    acc[id].seats += Number(b.seatsBooked);
    return acc;
  }, {});

  const events = Object.keys(grouped);
  const revenueData = Object.values(grouped).map(g => g.revenue);
  const seatsData = Object.values(grouped).map(g => g.seats);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } }
  };

  return (
    <div className={styles.organizerWrapper}>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1>Booking Monitoring</h1>
        </div>

        <div className={styles.summaryContainer}>
          <div className={styles.summaryCard}>
            <h3>Total Bookings</h3>
            <p>{totalBookings}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Total Revenue</h3>
            <p>₹{totalRevenue}</p>
          </div>
        </div>

        <div className={styles.chartsRow}>
          <div className={styles.chartContainer}>
            <h3>Revenue per Event</h3>
            <div className={styles.chartInner}>
              <Bar
                data={{
                  labels: events,
                  datasets: [{ label: "Revenue (₹)", data: revenueData, backgroundColor: "#4f46e5" }]
                }}
                options={chartOptions}
              />
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h3>Seats Booked per Event</h3>
            <div className={styles.chartInner}>
              <Bar
                data={{
                  labels: events,
                  datasets: [{ label: "Seats Booked", data: seatsData, backgroundColor: "#f97316" }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        <h2 className={styles.tableTitle}>Booking Details</h2>
        <table className={styles.bookingTable}>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Event ID</th>
              <th>Seats</th>
              <th>Total Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.eventId ?? "N/A"}</td>
                <td>{booking.seatsBooked}</td>
                <td>₹{booking.totalAmount}</td>
                <td>{new Date(booking.bookingDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default OrganizerDashboard;