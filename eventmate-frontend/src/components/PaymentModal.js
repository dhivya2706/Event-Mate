import React, { useState, useEffect } from "react";
import "../styles/Payment.css";

const PaymentModal = ({ bookingData, onClose }) => {

  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("CARD");
  const [paymentResult, setPaymentResult] = useState(null);

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const payNow = async () => {

    setLoading(true);

    const paymentData = {
      bookingId: bookingData.bookingId,
      eventId: bookingData.eventId,
      userId: loggedUser.id,
      paymentMethod: method,
      amount: bookingData.amount
    };

    try {
      const res = await fetch(
        "http://localhost:8080/api/payment/process",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData)
        }
      );

      const data = await res.json();
      setPaymentResult(data);

    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal-overlay">

      <div className="success-card">

        {!paymentResult ? (
          <>
            <h2>Complete Payment</h2>
            <p>Amount: ₹{bookingData.amount}</p>

            <div className="method-group">
              {["CARD","UPI","PAYPAL"].map(m => (
                <button
                  key={m}
                  className={`method-btn ${method===m?"active":""}`}
                  onClick={() => setMethod(m)}
                >
                  {m}
                </button>
              ))}
            </div>

            <button
              className="pay-btn"
              onClick={payNow}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </>
        ) : (
          <>
            <h2>Payment Successful ✅</h2>

            <p>Transaction: {paymentResult.transactionId}</p>

            <img
              className="qr-image"
              src={`http://localhost:8080/qrcodes/${paymentResult.transactionId}.png`}
              alt="QR"
            />

            <button className="pay-btn" onClick={onClose}>
              Close
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;