// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    address: "",
    role: "",
  });

  useEffect(() => {
  const email = localStorage.getItem("email");

  if (!email) {
    navigate("/", { replace: true });
    return;
  }

  axios.get(`http://localhost:8080/users/${email}`)
    .then(res => {
      setUser(res.data);
    })
    .catch(err => {
      console.error(err);
      alert("Error loading profile");
    });

}, [navigate]);

  const displayName =
    user.firstName || user.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : localStorage.getItem("username") || "User";

  const avatarLetter = (displayName || "U").charAt(0).toUpperCase();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSave = async () => {
  try {
    await axios.put("http://localhost:8080/users/update", {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      dob: user.dob,
      address: user.address,
      role: user.role
    });

    alert("Profile updated successfully!");

    localStorage.setItem("firstName", user.firstName);
    localStorage.setItem("lastName", user.lastName);
    localStorage.setItem("gender", user.gender);
    localStorage.setItem("dob", user.dob);
    localStorage.setItem("address", user.address);

  } catch (error) {
    console.error(error);
    alert("Error updating profile");
  }
};

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Top: back link */}
        <div className="profile-header">
          <button
            className="profile-back-link"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* User summary */}
        <div className="profile-summary">
          <div className="profile-avatar">{avatarLetter}</div>
          <div>
            <h2 className="profile-title">{displayName}</h2>
            <p className="profile-subtitle">{user.email || "No email set"}</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="profile-divider" />

        {/* Form */}
        <form
          className="profile-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="profile-grid">
            {/* First Name */}
            <div className="profile-field">
              <label className="profile-label" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                className="profile-input"
                type="text"
                value={user.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </div>

            {/* Last Name */}
            <div className="profile-field">
              <label className="profile-label" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                className="profile-input"
                type="text"
                value={user.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>

            {/* Gender */}
            <div className="profile-field">
              <label className="profile-label" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="profile-input"
                value={user.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="profile-field">
              <label className="profile-label" htmlFor="dob">
                Date of Birth
              </label>
              <input
                id="dob"
                name="dob"
                className="profile-input"
                type="date"
                value={user.dob}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="profile-field full-width">
              <label className="profile-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                className="profile-input"
                type="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            {/* Address */}
            <div className="profile-field full-width">
              <label className="profile-label" htmlFor="address">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                className="profile-input profile-textarea"
                value={user.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </div>

            {/* Role */}
            <div className="profile-field">
              <label className="profile-label" htmlFor="role">
                Role
              </label>
              <input
                id="role"
                name="role"
                className="profile-input"
                type="text"
                value={user.role}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          <div className="profile-actions">
            <button type="submit" className="profile-save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;