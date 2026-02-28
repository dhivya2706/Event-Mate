import React, { useState, useEffect } from "react";
import "../styles/Booking.css";
import PaymentModal from "./PaymentModal"; 

const Booking = ({ selectedEventData }) => {

  const [showPayment, setShowPayment] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const email = localStorage.getItem("email");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (selectedEventData) {
      setEvent(selectedEventData);
      setSelectedSeats([]);
    }
  }, [selectedEventData]);

  if (!event) return <h3>No Event Selected</h3>;

  const rows = Math.ceil(event.totalSeats / 10);
  const cols = 10;

  const getSeatCategory = (row) => {
    if (row <= 2) return "VIP";
    if (row <= 5) return "Premium";
    return "Regular";
  };

  const getSeatPrice = (category) => {
    if (category === "VIP") return event.ticketPrice + 500;
    if (category === "Premium") return event.ticketPrice + 200;
    return event.ticketPrice;
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
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
      const loggedUser = JSON.parse(localStorage.getItem("user"));

      if (!loggedUser) {
        alert("Please login first");
        return;
      }

      const bookingData = {
        userId: loggedUser.id,
        seatsBooked: selectedSeats.length,
        totalAmount: totalPrice,
        bookingStatus: "PENDING_PAYMENT",
        seats: selectedSeats.join(",")
      };

      const response = await fetch(
        `http://localhost:8080/api/bookings?eventId=${event.id}&email=${email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData)
        }
      );

      if (!response.ok) throw new Error("Booking failed");

      const booking = await response.json();

      setBookingInfo({
        bookingId: booking.id,
        eventId: event.id,
        amount: totalPrice
      });

      setShowPayment(true);

    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const renderSeats = () => {
    const seats = [];

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {

        const seatNumber = (r - 1) * cols + c;
        if (seatNumber > event.totalSeats) break;

        const seatId = `S${seatNumber}`;
        const category = getSeatCategory(r);

        seats.push(
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

    return seats;
  };

  return (
    <div className="booking-container">

      <div className="event-header">
        <h2>{event.eventName}</h2>
        <p>Base Price: ₹{event.ticketPrice}</p>
        <p>Total Seats: {event.totalSeats}</p>
      </div>

      <div className="legend">
        <span className="vip-box">VIP (+₹500)</span>
        <span className="premium-box">Premium (+₹200)</span>
        <span className="regular-box">Regular</span>
      </div>

      <div
        className="seats-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {renderSeats()}
      </div>

      <div className="summary">
        <p>Selected Seats: {selectedSeats.length}</p>
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
          onClose={() => setShowPayment(false)}
        />
      )}

    </div>
  );
};

export default Booking;