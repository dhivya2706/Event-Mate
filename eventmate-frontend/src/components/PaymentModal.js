import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const PaymentModal = ({ bookingData, onClose }) => {

  const hasOpened = useRef(false);
  const [showTicket, setShowTicket] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (bookingData && !hasOpened.current) {
      hasOpened.current = true;
      handlePayment();
    }
  }, [bookingData]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load.");
        return;
      }

      const res = await fetch("http://localhost:8080/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: bookingData.bookingId })
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const data = await res.json();

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "EventMate",
        description: "Event Booking Payment",
        order_id: data.orderId,

        handler: async function (response) {
          try {

            const confirmRes = await fetch(
              "http://localhost:8080/api/payment/confirm",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature
                })
              }
            );

            if (!confirmRes.ok) {
              throw new Error("Payment confirmation failed");
            }

            const ticketRes = await fetch(
              `http://localhost:8080/api/bookings/${bookingData.bookingId}`
            );

            const ticketData = await ticketRes.json();

            setTicket(ticketData);
            setShowTicket(true);

          } catch (error) {
            console.error("Confirm error:", error);
            alert("Payment verification failed!");
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled.");
            onClose();
          }
        },

        theme: {
          color: "#6C63FF"
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        alert("Payment Failed ❌");
        onClose();
      });

      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong!");
      onClose();
    }
  };

  const downloadTicket = () => {
    const element = document.getElementById("ticketCard");

    const options = {
      margin: 0.5,
      filename: `EventTicket_${ticket.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(options).from(element).save();
  };

  if (showTicket && ticket) {
    return (
      <div style={styles.overlay}>
        <div style={styles.ticket} id="ticketCard">

          <h2>🎟 EventMate Ticket</h2>
          <hr />

          <p><strong>User:</strong> {ticket.userName}</p>
          <p><strong>Booking ID:</strong> {ticket.id}</p>
          <p><strong>Event:</strong> {ticket.eventName}</p>
          <p><strong>Venue:</strong> {ticket.venue}</p>
          <p><strong>Seats Booked:</strong> {ticket.seatsBooked}</p>
          <p><strong>Total Paid:</strong> ₹{ticket.totalAmount}</p>
          <p><strong>Date:</strong> {ticket.bookingDate}</p>

          <div style={{ marginTop: "20px" }}>
            <button onClick={downloadTicket} style={styles.button}>
              Save Ticket
            </button>

            <button onClick={onClose} style={{ ...styles.button, background: "#f3e8ff", color: "#000" }}>
              Close
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="payment-modal">
      <h3>Redirecting to Payment Gateway...</h3>
      <p>Please do not refresh this page.</p>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },
  ticket: {
    background: `linear-gradient(
    120deg,
    #f8f7ff 0%,
    #eef2ff 30%,
    #f0f9ff 60%,
    #ffffff 100%
  )`,
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },
  button: {
    padding: "10px 15px",
    marginRight: "10px",
    background: "linear-gradient(to right,#7c3aed,#06b6d4)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default PaymentModal;