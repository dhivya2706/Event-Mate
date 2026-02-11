import React from "react";
import eventImg from "./assets/event.jpeg";
import "../styles/Home.css";

export default function Home({ onLogin }) {
  return (
    <section className="home">
      <div className="home-content">
        <h1 className="hero-title">
          AI Powered <span>Event Planner</span>
        </h1>

        <p className="hero-subtitle">
          EventMate is your smart AI event scheduler.  
          Plan, organize and manage events effortlessly with
          smart recommendations and automatic reminders.
        </p>

        <div className="hero-actions">
          <button className="primary-btn" onClick={onLogin}>
            Get Started
          </button>
        </div>
      </div>

      <div className="home-image">
        <img src={eventImg} alt="Event Planner" />
      </div>
    </section>
  );
}
