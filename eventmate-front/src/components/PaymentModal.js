import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import FeedbackForm from "./FeedbackForm";
import "../styles/Payment.css";

const PaymentModal = ({ bookingData, onClose }) => {
  const [loading,      setLoading]      = useState(false);
  const [method,       setMethod]       = useState("RAZORPAY");
  const [paymentResult,setPaymentResult]= useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error,        setError]        = useState("");

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // ✅ Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src   = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.style.overflow = "auto";
      document.body.removeChild(script);
    };
  }, []);

  // ================= RAZORPAY PAYMENT =================
  const payWithRazorpay = async () => {
    if (!loggedUser?.id) {
      alert("Session expired. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Create order on backend
      const orderRes = await fetch("http://localhost:8080/api/payment/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingData.bookingId,
          userId:    loggedUser.id,
          amount:    bookingData.amount,
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create payment order");
      const orderData = await orderRes.json();

      // Step 2: Open Razorpay checkout
      const options = {
        key:         orderData.razorpayKeyId,
        amount:      orderData.amount,         // in paise
        currency:    orderData.currency,
        name:        "EventMate",
        description: `Booking #${bookingData.bookingId}`,
        image:       "https://i.ibb.co/0j0Q3zB/logo.png", // optional logo
        order_id:    orderData.orderId,

        handler: async function (response) {
          // Step 3: Verify payment on backend
          const verifyRes = await fetch("http://localhost:8080/api/payment/verify", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId:         bookingData.bookingId,
              userId:            loggedUser.id,
              amount:            bookingData.amount,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.status === "SUCCESS") {
            setPaymentResult(verifyData);
          } else {
            setError("Payment verification failed. Please contact support.");
          }
          setLoading(false);
        },

        prefill: {
          name:  loggedUser.name  || "",
          email: loggedUser.email || "",
        },

        theme: { color: "#4f46e5" },

        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  // ================= DONE → SHOW FEEDBACK =================
  const handleDone = () => setShowFeedback(true);

  if (showFeedback) {
    return <FeedbackForm bookingData={bookingData} onClose={onClose} />;
  }

  return (
    <div className="payment-modal-overlay">
      <div className="success-card">

        {!paymentResult ? (
          <>
            <div style={{ fontSize:"2.5rem", marginBottom:"8px" }}>🎟️</div>
            <h2>Complete Payment</h2>

            <p className="amount-display">
              Amount: <strong>₹{bookingData.amount}</strong>
            </p>
            <p style={{ fontSize:"13px", color:"#888", margin:"4px 0 16px" }}>
              Booking ID: #{bookingData.bookingId}
            </p>

            {/* Payment method selector */}
            <div className="method-group">
              {[
                { key:"RAZORPAY", label:"💳 Razorpay" },
              ].map((m) => (
                <button
                  key={m.key}
                  className={`method-btn ${method === m.key ? "active" : ""}`}
                  onClick={() => setMethod(m.key)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Razorpay supports info */}
            <div style={{
              backgroundColor:"#f0f0ff", borderRadius:"10px",
              padding:"10px 14px", marginBottom:"16px",
              fontSize:"0.82rem", color:"#4f46e5", textAlign:"center"
            }}>
              💳 UPI &nbsp;|&nbsp; 🏦 Net Banking &nbsp;|&nbsp; 💰 Wallets &nbsp;|&nbsp; 💳 Cards
            </div>

            {error && (
              <div style={{ backgroundColor:"#fee2e2", color:"#dc2626", borderRadius:"8px", padding:"10px 14px", marginBottom:"14px", fontSize:"0.88rem" }}>
                ⚠️ {error}
              </div>
            )}

            <button
              className="pay-btn"
              onClick={payWithRazorpay}
              disabled={loading}
              style={{ backgroundColor:"#4f46e5" }}
            >
              {loading ? "Opening Razorpay..." : `Pay ₹${bookingData.amount} via Razorpay`}
            </button>

            <button
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
              style={{ marginTop:"10px", background:"transparent", border:"1px solid #444", color:"#aaa", padding:"10px", borderRadius:"8px", cursor:"pointer", width:"100%" }}
            >
              Cancel
            </button>
          </>

        ) : (
          <>
            <div style={{ fontSize:"48px", marginBottom:"8px" }}>✅</div>
            <h2>Payment Successful!</h2>

            <p>Transaction ID: <strong>{paymentResult.transactionId}</strong></p>
            <p style={{ fontSize:"13px", color:"#888" }}>Amount Paid: ₹{bookingData.amount}</p>

            {/* QR Code */}
            {paymentResult.transactionId && (
              <div style={{ marginTop:"20px" }}>
                <QRCodeCanvas
                  value={`Booking ID: ${bookingData.bookingId}\nTransaction ID: ${paymentResult.transactionId}\nAmount: ₹${bookingData.amount}`}
                  size={200}
                />
                <p style={{ fontSize:"12px", color:"#888", marginTop:"8px" }}>
                  Scan to verify your booking
                </p>
              </div>
            )}

            <button
              className="pay-btn"
              onClick={handleDone}
              style={{ marginTop:"20px", backgroundColor:"#10b981" }}
            >
              Continue → Give Feedback
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;