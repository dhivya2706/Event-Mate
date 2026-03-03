import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import FeedbackForm from "./FeedbackForm";   // ✅ IMPORT THIS
import "../styles/Payment.css";

const PaymentModal = ({ bookingData, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("CARD");
  const [paymentResult, setPaymentResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);  // ✅ NEW

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const payNow = async () => {
    if (!loggedUser || !loggedUser.id) {
      alert("Session expired. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingData.bookingId,
          eventId: bookingData.eventId,
          userId: loggedUser.id,
          paymentMethod: method,
          amount: bookingData.amount,
        }),
      });

      if (!res.ok) throw new Error("Payment failed");

      const data = await res.json();
      setPaymentResult(data);

    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 AFTER DONE CLICK → SHOW FEEDBACK
  const handleDone = () => {
    setShowFeedback(true);
  };

  // 🔥 IF FEEDBACK MODE → SHOW FEEDBACK FORM
  if (showFeedback) {
    return (
      <FeedbackForm
        bookingData={bookingData}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="payment-modal-overlay">
      <div className="success-card">

        {!paymentResult ? (
          <>
            <h2>Complete Payment</h2>

            <p className="amount-display">
              Amount: <strong>₹{bookingData.amount}</strong>
            </p>

            <p style={{ fontSize: "13px", color: "#888", margin: "4px 0 16px" }}>
              Booking ID: #{bookingData.bookingId}
            </p>

            <div className="method-group">
              {["CARD", "UPI", "PAYPAL"].map((m) => (
                <button
                  key={m}
                  className={`method-btn ${method === m ? "active" : ""}`}
                  onClick={() => setMethod(m)}
                >
                  {m === "CARD" && "💳 "}
                  {m === "UPI" && "📱 "}
                  {m === "PAYPAL" && "🅿️ "}
                  {m}
                </button>
              ))}
            </div>

            <button
              className="pay-btn"
              onClick={payNow}
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay ₹${bookingData.amount}`}
            </button>

            <button
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
              style={{
                marginTop: "10px",
                background: "transparent",
                border: "1px solid #444",
                color: "#aaa",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>✅</div>
            <h2>Payment Successful!</h2>

            <p>
              Transaction ID:{" "}
              <strong>{paymentResult.transactionId}</strong>
            </p>

            <p style={{ fontSize: "13px", color: "#888" }}>
              Amount Paid: ₹{bookingData.amount}
            </p>

            {paymentResult.transactionId && (
              <div style={{ marginTop: "20px" }}>
                <QRCodeCanvas
                  value={`Booking ID: ${bookingData.bookingId}
Transaction ID: ${paymentResult.transactionId}
Amount: ₹${bookingData.amount}`}
                  size={220}
                />
              </div>
            )}

            {/* 🔥 CHANGE HERE */}
            <button
              className="pay-btn"
              onClick={handleDone}
              style={{ marginTop: "20px" }}
            >
              Continue
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;