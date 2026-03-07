import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

export default function Login({ switchToRegister, setCurrentUser }) {

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/login", form);

      const userData = {
        id:    res.data.id,
        name:  res.data.name || form.email.split("@")[0],
        email: form.email,
        role:  res.data.role?.toUpperCase().trim(),
      };

      localStorage.setItem("user",       JSON.stringify(userData));
      localStorage.setItem("adminToken", res.data.token || "temp-token");
      localStorage.setItem("adminRole",  userData.role);
      localStorage.setItem("adminEmail", form.email);
      localStorage.setItem("adminName",  userData.name);
      localStorage.setItem("adminId",    userData.id);
      localStorage.setItem("isLoggedIn", "true");

      setCurrentUser(userData);

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* LOGO */}
        <div className="brand-icon-login">🎟️</div>
        <h1 className="login-title">EventMate <span>AI</span></h1>
        <p className="subtitle">Smart AI Event Scheduler</p>

        {/* FORM */}
        <form onSubmit={handleLogin}>

          <div className="input-group">
            <span className="field-icon">✉️</span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group password-group">
            <span className="field-icon">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button className="login-btn" type="submit">
            Sign In →
          </button>

        </form>

        {message && <p className="error-msg">{message}</p>}

        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={switchToRegister}>Register</span>
        </p>

      </div>
    </div>
  );
}