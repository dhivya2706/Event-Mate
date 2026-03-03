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
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8080/api/register", form);
      setMessage(res.data.message || "Registration successful!");
      setIsError(false);

      setForm({
        name: "",
        email: "",
        password: "",
        role: "USER",
      });
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Registration failed! Server error."
      );
      setIsError(true);
    }

    setLoading(false);
  };

  return (
    <div className="register-body">
      <div className="register-card">

        <div className="register-logo">
          <h2>EventMate AI Scheduler</h2>
          <p>Register your account</p>
        </div>

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
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="select-wrapper">
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="USER">USER</option>
              <option value="ORGANISER">ORGANISER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <div className={isError ? "register-error" : "register-success"}>
            {message}
          </div>
        )}

        <div className="register-footer">
          Already have an account?{" "}
          <span onClick={switchToLogin}>Login</span>
        </div>

      </div>
    </div>
  );
}