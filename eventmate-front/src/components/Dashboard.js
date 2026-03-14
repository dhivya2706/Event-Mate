import React, { useEffect, useState } from "react";

function Dashboard() {

  const [eventsCount, setEventsCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {

    try {

      const events = await fetch(`http://localhost:8080/api/organizer/events?organizerId=${user.id}`);
      const eventsData = await events.json();
      setEventsCount(eventsData.length);

      const bookings = await fetch(`http://localhost:8080/api/organizer/bookings?organizerId=${user.id}`);
      const bookingsData = await bookings.json();

      setBookingsCount(bookingsData.length);

      const totalRevenue = bookingsData.reduce(
        (sum, b) => sum + Number(b.totalAmount || 0),
        0
      );

      setRevenue(totalRevenue);

      const feedback = await fetch(`http://localhost:8080/api/organizer/feedback?organizerId=${user.id}`);
      const feedbackData = await feedback.json();

      setFeedbackCount(feedbackData.length);

    } catch (error) {

      console.log("Dashboard error", error);

    }

  };

  const pageStyle = {
    padding: "40px",
    fontFamily: "Segoe UI"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "25px",
    marginTop: "40px"
  };

  const cardStyle = {
    padding: "30px",
    borderRadius: "18px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: "0.3s"
  };

  const profileCard = {
    marginTop: "40px",
    padding: "30px",
    borderRadius: "18px",
    background: "white",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  };

  return (

    <div style={pageStyle}>

      <h1>Organizer Dashboard</h1>

      <p style={{color:"#666"}}>
        Welcome back {user?.name}
      </p>

      {/* STAT CARDS */}

      <div style={gridStyle}>

        <div style={{...cardStyle,background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
          <h2 style={{fontSize:"40px"}}>{eventsCount}</h2>
          <p>Total Events</p>
        </div>

        <div style={{...cardStyle,background:"linear-gradient(135deg,#10b981,#34d399)"}}>
          <h2 style={{fontSize:"40px"}}>{bookingsCount}</h2>
          <p>Total Bookings</p>
        </div>

        <div style={{...cardStyle,background:"linear-gradient(135deg,#f59e0b,#fbbf24)"}}>
          <h2 style={{fontSize:"40px"}}>₹{revenue}</h2>
          <p>Total Revenue</p>
        </div>

        <div style={{...cardStyle,background:"linear-gradient(135deg,#ec4899,#f472b6)"}}>
          <h2 style={{fontSize:"40px"}}>{feedbackCount}</h2>
          <p>Total Feedback</p>
        </div>

      </div>


      {/* ORGANIZER PROFILE */}

      <div style={profileCard}>

        <h2 style={{marginBottom:"20px"}}>Organizer Profile</h2>

        <p><strong>Name:</strong> {user?.name}</p>

        <p><strong>Email:</strong> {user?.email}</p>

        <p><strong>Status:</strong> Active</p>

      </div>

    </div>

  );

}

export default Dashboard;