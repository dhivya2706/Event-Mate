import React, { useState } from "react";
import "./Booking.css";

const eventTypes = {
  concert: {
    name: "Music Concert",
    type: "stadium",
    rows: 10,
    cols: 15,
    price: 1200,
  },
  sports: {
    name: "Sports Event",
    type: "stadium",
    rows: 12,
    cols: 18,
    price: 1500,
  },
  conference: {
    name: "Tech Conference",
    type: "hall",
    rows: 6,
    cols: 8,
    price: 800,
  },
};

const Booking= () => {
  const [selectedEvent, setSelectedEvent] = useState("concert");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const event = eventTypes[selectedEvent];

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = selectedSeats.length * event.price;

 const renderSeats = () => {
  const seats = [];
  for (let r = 1; r <= event.rows; r++) {
    for (let c = 1; c <= event.cols; c++) {
      const seatId = `${r}-${c}`;

      let seatType = "regular";
      if (r <= 2) seatType = "vip";
      else if (r <= 4) seatType = "premium";

      seats.push(
        <div
          key={seatId}
          className={`seat ${seatType} ${
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
      {/* Event Header */}
      <div className="event-header">
        <h2>Book Tickets</h2>
       <select
  className="event-dropdown"
  value={selectedEvent}
  onChange={(e) => {
    setSelectedEvent(e.target.value);
    setSelectedSeats([]);
  }}
>
  {Object.keys(eventTypes).map((key) => (
    <option key={key} value={key}>
      {eventTypes[key].name}
    </option>
  ))}
</select>
      </div>

      <div className="booking-content">
        {/* Seat Layout */}
        <div className="seat-layout">
          <div className="stage">
            {event.type === "stadium" ? "🏟 Stadium Stage" : "🎤 Conference Screen"}
          </div>

          <div
            className={`seats-grid ${event.type}`}
            style={{
              gridTemplateColumns: `repeat(${event.cols}, 1fr)`,
            }}
          >
            {renderSeats()}
          </div>
          <div className="legend">
  <div><span style={{background:"#facc15"}}></span> VIP</div>
  <div><span style={{background:"#60a5fa"}}></span> Premium</div>
  <div><span style={{background:"#e5e7eb"}}></span> Regular</div>
  <div><span style={{background:"#16a34a"}}></span> Selected</div>
</div>
        </div>

        {/* Booking Summary */}
        <div className="summary">
          <h3>Booking Summary</h3>
          <p>Event: {event.name}</p>
          <p>Price per Seat: ₹ {event.price}</p>
          <p>Selected Seats: {selectedSeats.length}</p>
          <p>Total: ₹ {totalPrice}</p>

          <button disabled={selectedSeats.length === 0}>
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;