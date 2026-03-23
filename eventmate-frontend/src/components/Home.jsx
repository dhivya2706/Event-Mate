import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="home-bg-grid"></div>

      <nav className="navbar">
        <div className="logo">Event<span>Mate</span></div>
        <div className="nav-right">
          <button className="signin-btn" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </nav>

      <div className="hero">
        <div className="badge">
          ✦ &nbsp; AI-Powered Event Planning
        </div>

        <h1 className="title">
          Plan Events<br />
          <span className="gradient">Smarter</span>{" "}with AI
        </h1>

        <div className="hero-line"></div>

        <p className="subtitle">
          EventMate uses artificial intelligence to help you discover,
          plan, and manage events effortlessly —
          from intimate gatherings to grand conferences.
        </p>

        <div className="hero-actions">
          <button className="cta-primary" onClick={() => navigate("/login")}>
            Get Started
          </button>
          <button className="cta-secondary" onClick={() => navigate("/user-register")}>
            Create Account
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">500+</div>
            <div className="stat-label">Events Hosted</div>
          </div>
          <div className="stat-sep"></div>
          <div className="stat">
            <div className="stat-number">12K</div>
            <div className="stat-label">Happy Attendees</div>
          </div>
          <div className="stat-sep"></div>
          <div className="stat">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
        </div>
      </div>

      <div className="scroll-cue">
        <div className="scroll-line"></div>
      </div>
    </div>
  );
}
