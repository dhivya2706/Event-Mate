import React, { useEffect, useState } from "react";

function OrganizerReview() {
  const [reviews, setReviews] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) return;

    fetch(`http://localhost:8080/api/feedback/organizer?email=${email}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      })
      .catch(err => {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      });

  }, [email]);

  return (
    <div className="content-card">
      <h2>Event Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        reviews.map((review, index) => (
          <div
            className="review-card"
            key={review.id ? review.id : index}
          >
            <h3>{review.event?.eventName}</h3>

            <p><strong>User:</strong> {review.userEmail}</p>

            <p>Rating: ⭐ {review.rating}/5</p>
            <p>{review.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default OrganizerReview;