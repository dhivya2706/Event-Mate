import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {

  const navigate = useNavigate();

  return (

    <div className="home">

      {/* Navbar */}

      <nav className="navbar">

        <div className="logo">
          ✦ EventMate
        </div>

        <div className="nav-right">
          <button
            className="signin-btn"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>

        </div>

      </nav>


      {/* Hero */}

      <div className="hero">

        <div className="badge">
          ✨ AI-Powered Event Planning
        </div>


        <h1 className="title">

          Plan Events <br />

          <span className="gradient">
            Smarter
          </span>

          {" "}with AI

        </h1>


        <p className="subtitle">

          EventMate uses artificial intelligence to help you discover,
          plan, and manage events effortlessly.
          From intimate meetups to massive conferences.

        </p>

      </div>

    </div>

  );

}