import React from "react";
import OrganizerDashboard from './Organizer';
import styles from "../styles/OrganizerHome.module.css";

function OrganizerHome({ goToBooking, onLogout }) {
  return (
    <div className={styles.dashboard}>

      <div className={styles.topBar}>
        <h1>Organizer Dashboard</h1>
        <button onClick={onLogout}>Logout</button>
      </div>

      <div className={styles.grid}>

        <div className={styles.card}>
          <h3>Event Creation & Management</h3>
          <p>Create, update, cancel events</p>
          <p>Title, Date, Venue, Category</p>
          <p>Capacity & Pricing</p>
        </div>

        <div className={styles.card}>
          <h3>Image & Media Upload</h3>
          <p>Upload banners & posters</p>
          <p>Display event images</p>
        </div>

        <div className={styles.card}>
          <h3>Booking & Attendee Management</h3>
          <p>View bookings</p>
          <p>Track seats</p>
          <p>Attendee details</p>
        </div>

        <div
          className={`${styles.card} ${styles.highlight}`}
          onClick={goToBooking}
        >
          <h3>Booking Monitoring</h3>
          <p>Payment status</p>
          <p>Ticket sales tracking</p>
        </div>

        <div className={styles.card}>
          <h3>QR Code Ticket Handling</h3>
          <p>View QR codes</p>
          <p>Scan & verify tickets</p>
        </div>

        <div className={styles.card}>
          <h3>Event Notifications</h3>
          <p>Send reminders</p>
          <p>Notify attendees</p>
        </div>

      </div>

    </div>
  );
}

export default OrganizerHome;
