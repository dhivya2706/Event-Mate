import React, { useState } from "react";
import axios from "axios";
import "../styles/Register.css";

export default function Register({ switchToLogin }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Password validation
  const validatePassword = (password) => {

    const regex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setIsError(false);

    // Confirm password check
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Password and Confirm Password must match");
      setIsError(true);
      return;
    }

    // Password strength check
    if (!validatePassword(form.password)) {
      setMessage(
        "❌ Password must contain:\n• 8 characters\n• 1 uppercase letter\n• 1 number\n• 1 special character"
      );
      setIsError(true);
      return;
    }

    setLoading(true);

    try {

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      const res = await axios.post("http://localhost:8080/api/register", payload);

      setMessage(res.data.message || "Registration successful!");
      setIsError(false);

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "USER",
      });

    } catch (err) {

      setMessage(
        err.response?.data?.message || "Registration failed! Server error."
      );
      setIsError(true);
    }

    setLoading(false);
  };

  return (
    <div className="register-body">
      <div className="register-card">

        <div className="register-logo">
          <div className="brand-icon">🎫</div>
          <h2>EventMate <span>AI</span></h2>
          <p>Create your account to get started</p>
        </div>

        <form onSubmit={handleRegister}>

          <div className="field-group">
            <span className="field-icon">👤</span>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <span className="field-icon">✉️</span>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <span className="field-icon">🔒</span>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="field-group">
            <span className="field-icon">🔐</span>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group select-wrapper">
            <span className="field-icon">🎭</span>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="USER">USER</option>
              <option value="ORGANISER">ORGANISER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>

        </form>

        {message && (
          <div className={isError ? "register-error" : "register-success"}>
            {message}
          </div>
        )}

        <div className="register-footer">
          Already have an account?{" "}
          <span onClick={switchToLogin}>Sign In</span>
        </div>

      </div>
    </div>
  );
}