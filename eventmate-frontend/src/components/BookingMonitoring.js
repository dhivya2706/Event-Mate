import "../styles/Dashboard.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const fmtDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }); }
  catch { return String(d); }
};

function BookingMonitoring() {
  const [bookings,      setBookings]      = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue,  setTotalRevenue]  = useState(0);
  const [confirmed,     setConfirmed]     = useState(0);
  const [pending,       setPending]       = useState(0);
  const [cancelled,     setCancelled]     = useState(0);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const email = localStorage.getItem("email");
      const [bRes, tRes, rRes, cRes, pRes, xRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/bookings/organizer?email=${email}`),
        axios.get(`http://localhost:8080/api/bookings/organizer/total?email=${email}`),
        axios.get(`http://localhost:8080/api/bookings/organizer/revenue?email=${email}`),
        axios.get(`http://localhost:8080/api/bookings/organizer/confirmed?email=${email}`),
        axios.get(`http://localhost:8080/api/bookings/organizer/pending?email=${email}`),
        axios.get(`http://localhost:8080/api/bookings/organizer/cancelled?email=${email}`),
      ]);
      setBookings(bRes.data);
      setTotalBookings(tRes.data);
      setTotalRevenue(rRes.data);
      setConfirmed(cRes.data);
      setPending(pRes.data);
      setCancelled(xRes.data);
    } catch (err) { console.error(err); }
  };

  const STATS = [
    { label:"Total Bookings", value: totalBookings,          color:"#c9a84c" },
    { label:"Revenue",        value: `₹${totalRevenue}`,     color:"#22c55e" },
    { label:"Confirmed",      value: confirmed,               color:"#4ade80" },
    { label:"Pending",        value: pending,                 color:"#fbbf24" },
    { label:"Cancelled",      value: cancelled,               color:"#f87171" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="bm-header">
        <div>
          <h2>Booking Monitor</h2>
          <p className="org-page-sub">All bookings for your events</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="bm-stats">
        {STATS.map(s => (
          <div key={s.label} className="bm-stat" style={{ borderLeftColor: s.color }}>
            <div className="bm-stat-val" style={{ color: s.color }}>{s.value}</div>
            <div className="bm-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bm-table-wrap">
        <table className="bm-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Event</th>
              <th>Seats</th>
              <th>Seat Type</th>
              <th>Payment Mode</th>
              <th>Payment Status</th>
              <th>Booking Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign:"center", padding:"40px", color:"var(--text-muted)" }}>No bookings yet</td></tr>
            ) : bookings.map(b => (
              <tr key={b.id}>
                <td style={{ color:"var(--text-muted)" }}>#{b.id}</td>
                <td style={{ fontWeight:600 }}>{b.userName || "User"}</td>
                <td>{b.eventName}</td>
                <td style={{ textAlign:"center" }}>{b.seatsBooked}</td>
                <td>
                  <span style={{
                    padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700,
                    background: b.seatCategory==="VIP" ? "rgba(201,168,76,.15)" : b.seatCategory==="PREMIUM" ? "rgba(99,102,241,.15)" : "rgba(34,197,94,.12)",
                    color:      b.seatCategory==="VIP" ? "#e8c97a"              : b.seatCategory==="PREMIUM" ? "#a5b4fc"              : "#86efac",
                    border:     `1px solid ${b.seatCategory==="VIP" ? "rgba(201,168,76,.3)" : b.seatCategory==="PREMIUM" ? "rgba(99,102,241,.3)" : "rgba(34,197,94,.25)"}`,
                  }}>{b.seatCategory || "N/A"}</span>
                </td>
                <td style={{ color:"var(--text-muted)", fontSize:12 }}>{b.paymentMode || "ONLINE"}</td>
                <td>
                  {b.paymentStatus === "PAID"
                    ? <span className="paid-badge">PAID</span>
                    : <span className="pending-badge">{b.paymentStatus || "PENDING"}</span>}
                </td>
                <td>
                  {b.bookingStatus === "Confirmed"
                    ? <span className="paid-badge">Confirmed</span>
                    : <span className="pending-badge">{b.bookingStatus || "Pending"}</span>}
                </td>
                <td style={{ color:"var(--text-muted)", fontSize:12 }}>{fmtDate(b.bookingDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingMonitoring;
