import React, { useState } from "react";
import "../styles/Feedback.css";

const FeedbackForm = ({ bookingData, onClose }) => {

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      await fetch("http://localhost:8080/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingData.bookingId,
          userId: bookingData.userId,
          eventId: bookingData.eventId,
          rating,
          comment
        })
      });

      alert("Thank you for your feedback ❤️");
      onClose();

    } catch (error) {
      alert("Feedback submission failed");
    }
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-card">
        <h2>⭐ Rate Your Experience</h2>

        <div className="stars">
          {[1,2,3,4,5].map(num => (
            <span
              key={num}
              className={num <= rating ? "star active" : "star"}
              onClick={() => setRating(num)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button onClick={handleSubmit}>
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;