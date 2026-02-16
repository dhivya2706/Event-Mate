import React, { useState } from "react";
import axios from "axios";
import "../styles/Register.css";

export default function Register({ switchToLogin }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/register",
        form
      );

      setMessage(res.data.message);

      // Clear form after success
      setForm({
        name: "",
        email: "",
        password: "",
        role: "USER"
      });

    } catch (err) {
      if (err.response && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Registration failed! Server error.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h1>EventMate AI Scheduler</h1>
        <p className="subtitle">Create your account</p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="USER">USER</option>
            <option value="ORGANISER">ORGANISER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {message && <p className="register-message">{message}</p>}

        <p className="switch-text">
          Already have an account?{" "}
          <span
            className="switch-link"
            onClick={switchToLogin}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
