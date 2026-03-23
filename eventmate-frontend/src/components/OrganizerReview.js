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

  const deleteReview = async (id) => {

    await fetch(`http://localhost:8080/api/feedback/${id}`, {
      method: "DELETE"
    });

    setReviews(reviews.filter(r => r.id !== id));

  };

  return (

    <div className="content-card">

     <h2 className="org-section-title">Event Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (

        <div className="rv-grid">

          {reviews.map((review, index) => (

            <div
              className="rv-card"
              key={review.id ? review.id : index}
            >

              <div className="rv-event">
                {review.event?.eventName}
              </div>

              <div className="rv-user">
                User: {review.userEmail}
              </div>

              <div className="rv-stars">
                {[1,2,3,4,5].map(star => (
                  <span
                    key={star}
                    className={`rv-star ${star <= review.rating ? "lit" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="rv-text">
                {review.description}
              </p>

              <button
                className="rv-delete-btn"
                onClick={() => deleteReview(review.id)}
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default OrganizerReview;