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
    confirmPassword: "",
    phone: "",
    companyName: "",
    role: "ORGANIZER",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };const handleRegister = async (e) => {
  e.preventDefault();

  const nameRegex = /^[A-Za-z ]{3,30}$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!nameRegex.test(form.name)) {
    setMessage("❌ Name must be 3-30 letters only");
    return;
  }

  if (!gmailRegex.test(form.email)) {
    setMessage("❌ Email must be a valid Gmail address");
    return;
  }

  if (!phoneRegex.test(form.phone)) {
    setMessage("❌ Phone number must be 10 digits and start with 6-9");
    return;
  }

  if (!passwordRegex.test(form.password)) {
    setMessage(
      "❌ Password must contain 8+ characters, 1 uppercase, 1 lowercase, 1 number & 1 special character"
    );
    return;
  }

  if (form.password !== form.confirmPassword) {
    setMessage("❌ Password and Confirm Password do not match");
    return;
  }


    setLoading(true);
    setMessage("");

    try {

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

      setMessage("✅ Registration Successful");

      setTimeout(() => {

        navigate("/login");

      }, 1500);

    }

    catch (err) {

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

        <p className="subtitle">
          Register your account
        </p>


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
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
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

          <p className="register-message">
            {message}
          </p>

        )}



        <p className="switch-text">

          Already have an account?

          <span
            className="switch-link"
            onClick={() => navigate("/login")}
          >

            Login

          </span>

        </p>


      </div>

    </div>

  );

}