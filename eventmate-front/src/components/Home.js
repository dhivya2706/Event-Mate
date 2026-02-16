import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import eventImg from "./assets/event.jpeg";

// Event images
import event1 from "./assets/event1.png";
import event2 from "./assets/event2.png";
import event3 from "./assets/event3.png";
import event4 from "./assets/event4.png";
import event5 from "./assets/event5.png";
import event6 from "./assets/event6.png";
import event7 from "./assets/event7.png";
import event8 from "./assets/event8.png";

const eventsData = [
  { name: "Saarang 2006", location: "IIT Madras, Chennai", img: event1 },
  { name: "Festember '06", location: "NIT Trichy", img: event2 },
  { name: "Techofes '06", location: "CEG, Chennai", img: event3 },
  { name: "Riviera 2006", location: "VIT, Vellore", img: event4 },
  { name: "Pradharshini 2006", location: "Kilpauk Medical College", img: event5 },
  { name: "Mitafest 2006", location: "MIT, Chromepet", img: event6 },
  { name: "Milan 2006", location: "SRM, Kattankulathur", img: event7 },
  { name: "Instincts 2006", location: "SSN, Chennai", img: event8 },
];

export default function Home({ onLogin }) {
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [showEventsSection, setShowEventsSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const newVisible = [];
      eventsData.forEach((_, index) => {
        const el = document.getElementById(`event-${index}`);
        if (el && scrollBottom >= el.offsetTop + el.offsetHeight / 3) newVisible.push(index);
      });
      setVisibleEvents((prev) => [...new Set([...prev, ...newVisible])]);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleViewEvents = () => {
    setShowEventsSection(true);
    const eventsSection = document.querySelector(".events-section");
    if (eventsSection) eventsSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="home">
        <div className="home-content">
          <h1 className="hero-title">
            AI Powered <span>Event Planner</span>
          </h1>
          <p className="hero-subtitle">
            EventMate is your smart AI event scheduler. Plan, organize and manage events effortlessly.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={onLogin}>Get Started</button>
            <button className="secondary-btn" onClick={handleViewEvents}>View Events</button>
          </div>
        </div>
        <div className="home-image">
          <img src={eventImg} alt="Event Planner" />
        </div>
      </section>

      {/* EVENTS SECTION */}
      {showEventsSection && (
        <section className="events-section">
          <h2>Upcoming Events</h2>
          <div className="events-grid">
            {eventsData.map((event, index) => (
              <div
                key={index}
                id={`event-${index}`}
                className={`event-card ${visibleEvents.includes(index) ? "show" : ""}`}
              >
                <img src={event.img} alt={event.name} />
                <h3>{event.name}</h3>
                <p>{event.location}</p>
                <button className="register-btn">Register</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="home-footer">
        <p>📧 Email: contact@eventmate.com | 📞 Phone: +91 98765 43210</p>
        <p>© 2026 EventMate. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
