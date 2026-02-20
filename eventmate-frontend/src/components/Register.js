import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    role: "ORGANISER", // default role
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Only send the fields your backend expects
      const res = await axios.post(
        "http://localhost:8080/api/organizer/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          companyName: form.companyName
        }
      );

      setMessage(res.data.message);

      // After successful registration → go to login
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Registration failed! Server error."
      );
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h1>EventMate AI Scheduler</h1>
        <p className="subtitle">Register your account</p>

        <form onSubmit={handleRegister}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
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

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <p className="register-message">{message}</p>
        )}

        <p className="switch-text">
          Already have an account?{" "}
          <span
            className="switch-link"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}