import React from "react";
import styles from "../styles/OrganizerHome.module.css";

function OrganizerHome({
  goToAddEvent,
  goToEventList,
  goToBookingManagement,
  goToBookingMonitoring,
  goToQRCodeBooking, // <-- add this prop
  onLogout
}) {
  return (
    <div className={styles.dashboard}>

      <div className={styles.topBar}>
        <h1>Organizer Dashboard</h1>
        <button onClick={onLogout}>Logout</button>
      </div>

      <div className={styles.grid}>

        {/* Event Creation */}
        <div
          className={styles.card}
          onClick={goToAddEvent}
          style={{ cursor: "pointer" }}
        >
          <h3>Event Creation & Management</h3>
          <p>Create, update, cancel events</p>
          <p>Title, Date, Venue, Category</p>
          <p>Capacity & Pricing</p>
        </div>

        {/* Image & Media Upload */}
        <div
          className={styles.card}
          onClick={goToEventList}
          style={{ cursor: "pointer" }}
        >
          <h3>Image & Media Upload</h3>
          <p>Upload banners & posters</p>
          <p>Display event images</p>
        </div>

        {/* Booking & Attendee Management */}
        <div
          className={styles.card}
          onClick={goToBookingManagement}
          style={{ cursor: "pointer" }}
        >
          <h3>Booking & Attendee Management</h3>
          <p>View bookings</p>
          <p>Track seats</p>
          <p>Attendee details</p>
        </div>

        {/* Booking Monitoring */}
        <div
          className={`${styles.card} ${styles.highlight}`}
          onClick={goToBookingMonitoring}
          style={{ cursor: "pointer" }}
        >
          <h3>Booking Monitoring</h3>
          <p>Payment status</p>
          <p>Ticket sales tracking</p>
        </div>

        {/* QR Code Handling */}
        <div
          className={styles.card}
          style={{ cursor: "pointer" }}
          onClick={goToQRCodeBooking} // <-- add this to open QRCodeBooking page
        >
          <h3>QR Code Ticket Handling</h3>
          <p>View QR codes</p>
          <p>Scan & verify tickets</p>
        </div>

        {/* Event Notifications */}
        <div
          className={styles.card}
          style={{ cursor: "pointer" }}
        >
          <h3>Event Notifications</h3>
          <p>Send reminders</p>
          <p>Notify attendees</p>
        </div>

      </div>

    </div>
  );
}

export default OrganizerHome;