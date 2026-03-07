import React from "react";
import styles from "../styles/OrganizerHome.module.css";

function OrganizerHome({
  goToAddEvent,
  goToEventList,
  goToBookingManagement,
  goToBookingMonitoring,
  goToQRCodeBooking,
  goToNotifications,
  goToProfile,
  onLogout,
}) {

  const organizerName = localStorage.getItem("username") || "Organizer";

  return (
    <div className={styles.dashboard}>

      {/* Top Bar */}
      <div className={styles.topBar}>

        <div>
          <h1>Organizer Dashboard</h1>
          <p style={{margin:0,color:"#555"}}>
            Welcome, <strong>{organizerName}</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={goToProfile}>Profile</button>
          <button onClick={onLogout}>Logout</button>
        </div>

      </div>


      {/* Dashboard Cards */}
      <div className={styles.grid}>

        {/* Event Creation */}
        <div
          className={styles.card}
          onClick={goToAddEvent}
          style={{ cursor: "pointer" }}
        >
          <h3>Event Creation & Management</h3>
          <p>Create new events</p>
          <p>Update or delete events</p>
          <p>Set venue, date & capacity</p>
        </div>


        {/* Event List */}
        <div
          className={styles.card}
          onClick={goToEventList}
          style={{ cursor: "pointer" }}
        >
          <h3>Image & Media Upload</h3>
          <p>Upload event posters</p>
          <p>Manage event images</p>
          <p>Preview event banners</p>
        </div>


        {/* Booking Management */}
        <div
          className={styles.card}
          onClick={goToBookingManagement}
          style={{ cursor: "pointer" }}
        >
          <h3>Booking & Attendee Management</h3>
          <p>View bookings</p>
          <p>Confirm or cancel bookings</p>
          <p>Manage attendees</p>
        </div>


        {/* Booking Monitoring */}
        <div
          className={`${styles.card} ${styles.highlight}`}
          onClick={goToBookingMonitoring}
          style={{ cursor: "pointer" }}
        >
          <h3>Booking Monitoring</h3>
          <p>Track ticket sales</p>
          <p>View revenue analytics</p>
          <p>Monitor seat bookings</p>
        </div>


        {/* QR Code Ticket */}
        <div
          className={styles.card}
          onClick={goToQRCodeBooking}
          style={{ cursor: "pointer" }}
        >
          <h3>QR Code Ticket Handling</h3>
          <p>Scan tickets</p>
          <p>Verify entry</p>
          <p>Confirm payments</p>
        </div>


        {/* Notifications */}
        <div
          className={styles.card}
          onClick={goToNotifications}
          style={{ cursor: "pointer" }}
        >
          <h3>Event Notifications</h3>
          <p>Send reminders</p>
          <p>Notify attendees</p>
          <p>View feedback</p>
        </div>

      </div>

    </div>
  );
}

export default OrganizerHome;