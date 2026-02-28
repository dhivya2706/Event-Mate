import "../styles/Dashboard.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function BookingMonitoring() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [confirmed, setConfirmed] = useState(0);
  const [pending, setPending] = useState(0);
  const [cancelled, setCancelled] = useState(0);


  const fetchData = async () => {
    try {

      const email = localStorage.getItem("email");

      const bookingsRes = await axios.get(
        `http://localhost:8080/api/bookings/organizer?email=${email}`
      );

      const totalRes = await axios.get(
        `http://localhost:8080/api/bookings/organizer/total?email=${email}`
      );

      const revenueRes = await axios.get(
        `http://localhost:8080/api/bookings/organizer/revenue?email=${email}`
      );

      const confirmedRes = await axios.get(
        `http://localhost:8080/api/bookings/organizer/confirmed?email=${email}`
      );

      const pendingRes = await axios.get(
        `http://localhost:8080/api/bookings/organizer/pending?email=${email}`
      );

      const cancelledRes = await axios.get(
        `http://localhost:8080/api/bookings/organizer/cancelled?email=${email}`
      );

      setBookings(bookingsRes.data);
      setTotalBookings(totalRes.data);
      setTotalRevenue(revenueRes.data);
      setConfirmed(confirmedRes.data);
      setPending(pendingRes.data);
      setCancelled(cancelledRes.data);

    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const grouped = bookings.reduce((acc, b) => {
    const name = b.eventName ?? "Unknown Event";

    if (!acc[name]) acc[name] = { revenue: 0, seats: 0 };

    acc[name].revenue += b.totalAmount;
    acc[name].seats += b.seatsBooked;

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
    <div >

      <h1>Booking Monitoring</h1>

      <div className="summary-container">
        <div className="summary-card">
          <h3>Total Bookings</h3>
          <p>{totalBookings}</p>
        </div>

        <div className="summary-card">
          <h3>Confirmed</h3>
          <p>{confirmed}</p>
        </div>

        <div className="summary-card">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>

        <div className="summary-card">
          <h3>Cancelled</h3>
          <p>{cancelled}</p>
        </div>
      </div>
      <h2>Booking Details</h2>

      <table className="booking-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User</th>
            <th>Event</th>
            <th>Seats</th>
            <th>Payment Mode</th>
            <th>Payment Status</th>
            <th>Booking Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.userName || "User"}</td>
              <td>{booking.eventName}</td>
              <td>{booking.seatsBooked}</td>
              <td>{booking.paymentMode ?? "Pending"}</td>
              <td>{booking.paymentStatus ?? "Pending"}</td>
              <td className={booking.bookingStatus.toLowerCase()}>
                {booking.bookingStatus}
              </td>
              <td>
                {booking.bookingDate
                  ? new Date(booking.bookingDate).toLocaleString()
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div >
  );
}

export default BookingMonitoring;
