import React, { useState, useEffect } from "react";
import "../styles/Booking.css";
import PaymentModal from "./PaymentModal";

const Booking = ({ selectedEventData }) => {

  const [showPayment, setShowPayment] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const email = localStorage.getItem("email");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [event, setEvent] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    if (selectedEventData) {
      setEvent(selectedEventData);
      setSelectedSeats([]);
    }
  }, [selectedEventData]);

  useEffect(() => {
    if (!event) return;

    const fetchBookedSeats = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/bookings/event/${event.id}`
        );

        const data = await response.json();
        const seats = data
          .filter(b => b.paymentStatus === "PAID")
          .flatMap(b => b.seatNumbers?.split(",") || []);

        setBookedSeats(seats);

      } catch (err) {
        console.error("Error fetching booked seats", err);
      }
    };

    fetchBookedSeats();

  }, [event]);

  if (!event) return <h3>No Event Selected</h3>;

  const totalSeats =
    event.vipSeats +
    event.premiumSeats +
    event.regularSeats;

  const cols = 10;
  const rows = Math.ceil(totalSeats / cols);
  const getSeatCategory = (seatNumber) => {
    if (seatNumber <= event.vipSeats) return "VIP";

    if (
      seatNumber <= event.vipSeats + event.premiumSeats
    ) return "Premium";

    return "Regular";
  };

  const getSeatPrice = (category) => {
    if (category === "VIP") return event.vipPrice;
    if (category === "Premium") return event.premiumPrice;
    return event.regularPrice;
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats(prev => {
      const updated = prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId];

      console.log("Selected Seats:", updated);
      return updated;
    });
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seatNumber = parseInt(seatId.replace("S", ""));
    const category = getSeatCategory(seatNumber);
    return total + getSeatPrice(category);
  }, 0);

  const confirmBooking = async () => {
    try {
      const loggedUser = JSON.parse(localStorage.getItem("user"));

      if (!loggedUser) {
        alert("Please login first");
        return;
      }

      const categories = selectedSeats.map(seatId => {
        const seatNumber = parseInt(seatId.replace("S", ""));
        return getSeatCategory(seatNumber);
      });

      const uniqueCategories = [...new Set(categories)];

      const finalCategory =
        uniqueCategories.length === 1
          ? uniqueCategories[0]
          : "Mixed";

      const bookingData = {
        eventId: event.id,
        seatCategory: finalCategory,
        seatsBooked: selectedSeats.length,
        totalAmount: totalPrice,
        userName: loggedUser.name,
        userEmail: loggedUser.email,
        seatNumbers: selectedSeats
      };

      const response = await fetch(
        "http://localhost:8080/api/bookings/create",
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
      alert("Booking failed!");
    }
  };
  const renderSeats = () => {
    const seats = [];

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {

        const seatNumber = (r - 1) * cols + c;
        if (seatNumber > totalSeats) break;

        const seatId = `S${seatNumber}`;
        const category = getSeatCategory(seatNumber);

        seats.push(
          <div
            key={seatId}
            className={`seat ${category.toLowerCase()}
  ${selectedSeats.includes(seatId) ? "selected" : ""}
  ${bookedSeats.includes(seatId) ? "booked" : ""}
`}
            onClick={() => {
              if (!bookedSeats.includes(seatId)) {
                toggleSeat(seatId);
              }
            }}
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

        <p>VIP Price: ₹{event.vipPrice}</p>
        <p>Premium Price: ₹{event.premiumPrice}</p>
        <p>Regular Price: ₹{event.regularPrice}</p>

        <p>Total Seats: {totalSeats}</p>
      </div>

      <div className="legend">
        <span className="vip-box">VIP</span>
        <span className="premium-box">Premium</span>
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