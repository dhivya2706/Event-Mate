import React, { useState, useEffect } from "react";
import "../styles/Booking.css";
import PaymentModal from "./PaymentModal";

const Booking = ({ selectedEventData, currentUser }) => {

  const [event, setEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);

  useEffect(() => {
    if (selectedEventData) {
      setEvent(selectedEventData);
      setSelectedSeats([]);
    }
  }, [selectedEventData]);

  if (!event) {
    return (
      <h3 style={{ textAlign: "center", marginTop: "40px" }}>
        No Event Selected — Browse Events to Book
      </h3>
    );
  }

  const cols = 10;
  const rows = Math.ceil(event.capacity / cols);

  const getSeatCategory = (row) => {
    if (row <= 2) return "VIP";
    if (row <= 5) return "Premium";
    return "Regular";
  };

  const getSeatPrice = (category) => {
    if (category === "VIP") return event.price + 500;
    if (category === "Premium") return event.price + 200;
    return event.price;
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seatNumber = parseInt(seatId.replace("S", ""));
    const row = Math.ceil(seatNumber / cols);
    const category = getSeatCategory(row);
    return total + getSeatPrice(category);
  }, 0);

  const confirmBooking = async () => {
    try {
      const loggedUser =
        currentUser || JSON.parse(localStorage.getItem("user"));

      if (!loggedUser || !loggedUser.id) {
        alert("User not found. Please login again.");
        return;
      }

      // 🔥 IMPORTANT DEBUG
      console.log("EVENT OBJECT:", event);
      console.log("EVENT ID:", event?.eventId);

      if (!event?.eventId) {
        alert("Event ID missing! Check console.");
        return;
      }

      const bookingData = {
        userId: loggedUser.id,
        eventId: event.eventId,
        seatsBooked: selectedSeats.length,
        totalAmount: totalPrice,
        seats: selectedSeats.join(","),
      };

      console.log("BOOKING DATA SENT:", bookingData);

      const response = await fetch(
        "http://localhost:8080/api/bookings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      const booking = await response.json();

      setBookingInfo({
        bookingId: booking.id,
        eventId: booking.eventId,
        amount: booking.totalAmount,
        userId: booking.userId,
      });

      setShowPayment(true);

    } catch (error) {
      console.error("Booking Error:", error);
      alert("Booking failed.");
    }
  };

  const renderSeats = () => {
    const seatElements = [];

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {

        const seatNumber = (r - 1) * cols + c;
        if (seatNumber > event.capacity) break;

        const seatId = `S${seatNumber}`;
        const category = getSeatCategory(r);

        seatElements.push(
          <div
            key={seatId}
            className={`seat ${category.toLowerCase()} ${
              selectedSeats.includes(seatId) ? "selected" : ""
            }`}
            onClick={() => toggleSeat(seatId)}
          >
            {seatId}
          </div>
        );
      }
    }

    return seatElements;
  };

  return (
    <div className="booking-container">

      <div className="event-header">
        <h2>{event.title}</h2>
        <p>📍 {event.venue}</p>
        <p>Base Price: ₹{event.price}</p>
        <p>Total Seats: {event.capacity}</p>
      </div>

      <div className="legend">
        <span className="vip-box">VIP (+₹500)</span>
        <span className="premium-box">Premium (+₹200)</span>
        <span className="regular-box">Regular (Base)</span>
      </div>

      <div
        className="seats-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {renderSeats()}
      </div>

      <div className="summary">
        <p>
          Selected Seats:{" "}
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "None"}
        </p>
        <p>Total Price: ₹{totalPrice}</p>

        <button
          disabled={!selectedSeats.length}
          onClick={confirmBooking}
        >
          Confirm Booking
        </button>
      </div>

      {showPayment && bookingInfo && (
        <PaymentModal
          bookingData={bookingInfo}
          onClose={() => {
            setShowPayment(false);
            setSelectedSeats([]);
          }}
        />
      )}

    </div>
  );
};

export default Booking;