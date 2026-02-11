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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/register",
        form
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Registration failed!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>EventMate AI Scheduler</h1>
        <p className="subtitle">Register your account</p>

        <form onSubmit={handleRegister}>
          <input name="name" placeholder="Name" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

          <select name="role" onChange={handleChange}>
            <option value="USER">USER</option>
            <option value="CONSUMER">CONSUMER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button type="submit">Register</button>
        </form>

        {message && <p className="register-message">{message}</p>}

        <p className="switch-text">
          Already have an account?{" "}
          <span className="switch-link" onClick={switchToLogin}>Login</span>
        </p>
      </div>
    </div>
  );
}
