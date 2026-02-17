import "../styles/Dashboard.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function OrganizerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchData = async () => {
    try {
      const bookingsRes = await axios.get(`http://localhost:8080/api/bookings`);
      const totalRes = await axios.get(`http://localhost:8080/api/bookings/total`);
      const revenueRes = await axios.get(`http://localhost:8080/api/bookings/revenue`);

      setBookings(bookingsRes.data);
      setTotalBookings(totalRes.data);
      setTotalRevenue(revenueRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const grouped = bookings.reduce((acc, b) => {
    const id = b.eventId ?? "N/A";

    if (!acc[id]) acc[id] = { revenue: 0, seats: 0 };

    acc[id].revenue += b.totalAmount;
    acc[id].seats += b.seatsBooked;

    return acc;
  }, {});

  const events = Object.keys(grouped);
  const revenueData = Object.values(grouped).map(g => g.revenue);
  const seatsData = Object.values(grouped).map(g => g.seats);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } }
    },
    datasets: {
      bar: {
        barPercentage: 0.5,
        categoryPercentage: 0.6
      }
    }
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1>Booking Monitoring</h1>
      </div>

      {/* Summary */}
      <div className="summary-container">
        <div className="summary-card">
          <h3>Total Bookings</h3>
          <p>{totalBookings}</p>
        </div>

        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue}</p>
        </div>
      </div>

      <div className="charts-row">

        <div className="chart-container">
          <h3>Revenue per Event</h3>
          <div className="chart-inner">
            <Bar
              data={{
                labels: events,
                datasets: [
                  {
                    label: "Revenue (₹)",
                    data: revenueData,
                    backgroundColor: "#4f46e5"
                  }
                ]
              }}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="chart-container">
          <h3>Seats Booked per Event</h3>
          <div className="chart-inner">
            <Bar
              data={{
                labels: events,
                datasets: [
                  {
                    label: "Seats Booked",
                    data: seatsData,
                    backgroundColor: "#f97316"
                  }
                ]
              }}
              options={chartOptions}
            />
          </div>
        </div>

      </div>

      {/* Table */}
      <h2>Booking Details</h2>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Event ID</th>
            <th>Seats Booked</th>
            <th>Total Amount</th>
            <th>Booking Date</th>
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
  );
}

export default OrganizerDashboard;
