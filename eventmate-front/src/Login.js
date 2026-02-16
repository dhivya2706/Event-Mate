import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Login({ switchToRegister, setCurrentUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/login",
        form
      );

      setCurrentUser({
        email: form.email,
        role: res.data.role,
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>EventMate AI Scheduler</h1>
        <p className="subtitle">Smart AI Event Planner</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        <div className="social-login">
          <p>Or login with</p>
          <div className="social-icons">
            <FaGoogle />
            <FaGithub />
            <FaLinkedin />
          </div>
        </div>

        <p className="switch-text">
          Don't have an account?
          <span className="switch-link" onClick={switchToRegister}>
            {" "}
            Register
          </span>
        </p>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
