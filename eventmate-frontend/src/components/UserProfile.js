import React, { useState, useEffect } from "react";
import axios from "axios";

function UserProfile({ closeModal, updateName }) {

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/user/profile?email=${email}`
        );
        setUser(res.data);
      } catch (err) {
        alert("Failed to load profile");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [email]);

  const handleUpdate = async () => {

    setSaving(true);

    try {
      const res = await axios.put(
        "http://localhost:8080/api/user/profile",
        user
      );

      setUser(res.data);

      localStorage.setItem("username", res.data.name);
      localStorage.setItem("phone", res.data.phone);

      updateName(res.data.name);  
      alert("Profile updated!");

    } catch {
      alert("Update failed");
    }

    setSaving(false);
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <>
      <h3>User Profile</h3>

      <input
        className="profile-input"
        value={user.name || ""}
        onChange={(e)=>setUser({...user,name:e.target.value})}
        placeholder="Name"
      />

      <input
        className="profile-input"
        value={user.email || ""}
        disabled
      />

      <input
        className="profile-input"
        value={user.phone || ""}
        onChange={(e)=>setUser({...user,phone:e.target.value})}
        placeholder="Phone"
      />

      <button className="modal-btn" onClick={handleUpdate}>
        {saving ? "Saving..." : "Update"}
      </button>

      <button className="cancel-btn" onClick={closeModal}>
        Close
      </button>
    </>
  );
}

export default UserProfile;