import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

export default function Login({ switchToRegister, setCurrentUser, setPage }) {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Login request
      const res = await axios.post("http://localhost:8080/api/login", form);

      const role = res.data.role?.toUpperCase().trim();

      // Save token and role in localStorage for future API calls
      localStorage.setItem("adminToken", res.data.token || "temp-token"); // token from backend
      localStorage.setItem("adminRole", role);
      localStorage.setItem("adminEmail", form.email);

      setCurrentUser({
        email: form.email,
        role: role,
      });

      // Navigate based on role
      if (role === "ADMIN") setPage("ADMIN");
      else if (role === "ORGANISER" || role === "ORGANIZER") setPage("ORGANIZER_HOME");
      else setPage("USER");

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="login-title">EventMate AI Scheduler</h1>
        <p className="subtitle">Smart AI Event Planner</p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>

        </form>

        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={switchToRegister}>Register</span>
        </p>

        {message && <p className="error-msg">{message}</p>}

      </div>
    </div>
  );
}