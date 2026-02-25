import React, { useState } from "react";
import axios from "axios";
import "../styles/Register.css";

function Register({ switchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleRegister = async () => {
    const { name, email, password, role } = form;

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:8080/api/users/register", {
        name,
        email,
        password,
        role,
      });

      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => switchToLogin(), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="register-body">
      <div className="register-card">

        {/* Logo / Title */}
        <div className="register-logo">
          <h2>EVENTMATE</h2>
          <p>Create your account</p>
        </div>

        {/* Feedback */}
        {error   && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}

        {/* Inputs */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {/* Role Dropdown */}
        <div className="select-wrapper">
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="USER">User</option>
            <option value="ORGANISER">Organiser</option>
          </select>
        </div>

        {/* Register Button */}
        <button
          className="register-btn"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Login Link */}
        <div className="register-footer">
          Already have an account?{" "}
          <span onClick={switchToLogin}>Login</span>
        </div>

      </div>
    </div>
  );
}

export default Register;