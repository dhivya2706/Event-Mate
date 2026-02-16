import React from "react";
import eventImg from "../assets/event.jpeg";
import "../styles/Home.css";

export default function Home({ onLogin }) {
  return (
    <div className="home">
      <div className="home-content">
        <h1>AI Powered Event Planner</h1>
        <p>
          EventMate is your smart AI event scheduler. Plan, organize and manage
          events with ease.
        </p>
        <button onClick={onLogin}>Get Started</button>
      </div>

      <div className="home-image">
        <img src={eventImg} alt="Event Planner" />
      </div>
    </div>
  );
}
