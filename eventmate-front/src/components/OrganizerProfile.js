import React, { useState } from "react";

function OrganizerProfile({ user, goBack }) {

  // ✅ Read from user prop first, fallback to localStorage
  const [profile, setProfile] = useState({
    name: user?.name || localStorage.getItem("adminName") || "",
    email: user?.email || localStorage.getItem("adminEmail") || "",
    password: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:8080/api/organizer/profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      if (!res.ok) throw new Error("Failed to update profile");

      // ✅ Update localStorage so navbar/header reflects new name
      localStorage.setItem("adminName", profile.name);
      localStorage.setItem("adminEmail", profile.email);

      setMessage("✅ Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setMessage("❌ Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={pageStyles.wrapper}>
      <div style={pageStyles.card}>

        {/* Back Button */}
        <button onClick={goBack} style={pageStyles.backBtn}>
          &#8592; Back
        </button>

        {/* Avatar */}
        <div style={pageStyles.avatarCircle}>
          {profile.name ? profile.name.charAt(0).toUpperCase() : "O"}
        </div>

        <h2 style={pageStyles.heading}>Organizer Profile</h2>

        {/* Role Badge */}
        <span style={pageStyles.roleBadge}>ORGANISER</span>

        {message && (
          <p style={{
            ...pageStyles.message,
            color: message.startsWith("✅") ? "#22c55e" : "#ef4444"
          }}>
            {message}
          </p>
        )}

        <div style={pageStyles.form}>

          {/* Name */}
          <div style={pageStyles.fieldGroup}>
            <label style={pageStyles.label}>Full Name</label>
            <input
              style={{
                ...pageStyles.input,
                background: editMode ? "#fff" : "#f8fafc",
                borderColor: editMode ? "#4f46e5" : "#e2e8f0"
              }}
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          {/* Email */}
          <div style={pageStyles.fieldGroup}>
            <label style={pageStyles.label}>Email Address</label>
            <input
              style={{
                ...pageStyles.input,
                background: editMode ? "#fff" : "#f8fafc",
                borderColor: editMode ? "#4f46e5" : "#e2e8f0"
              }}
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          {/* Role - always read only */}
          <div style={pageStyles.fieldGroup}>
            <label style={pageStyles.label}>Role</label>
            <input
              style={{ ...pageStyles.input, background: "#f8fafc", color: "#94a3b8" }}
              value={user?.role || "ORGANISER"}
              disabled
            />
          </div>

          {/* Password — only show in edit mode */}
          {editMode && (
            <div style={pageStyles.fieldGroup}>
              <label style={pageStyles.label}>
                New Password{" "}
                <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                  (leave blank to keep current)
                </span>
              </label>
              <input
                style={{ ...pageStyles.input, background: "#fff", borderColor: "#4f46e5" }}
                name="password"
                type="password"
                placeholder="Enter new password"
                value={profile.password}
                onChange={handleChange}
              />
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div style={pageStyles.btnRow}>
          {!editMode ? (
            <button style={pageStyles.editBtn} onClick={() => setEditMode(true)}>
              ✏️ Edit Profile
            </button>
          ) : (
            <>
              <button style={pageStyles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
              <button
                style={pageStyles.cancelBtn}
                onClick={() => { setEditMode(false); setMessage(""); }}
              >
                Cancel
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

const pageStyles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 16px"
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "460px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  backBtn: {
    alignSelf: "flex-start",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
    color: "#4f46e5",
    marginBottom: "16px",
    padding: "0",
    fontWeight: "600"
  },
  avatarCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "2.2rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
    boxShadow: "0 4px 12px rgba(79,70,229,0.3)"
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "6px"
  },
  roleBadge: {
    background: "#ede9fe",
    color: "#4f46e5",
    borderRadius: "20px",
    padding: "4px 14px",
    fontSize: "0.8rem",
    fontWeight: "700",
    letterSpacing: "0.05em",
    marginBottom: "20px"
  },
  form: { width: "100%" },
  fieldGroup: { marginBottom: "16px", width: "100%" },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#64748b",
    marginBottom: "6px"
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "1rem",
    color: "#1e293b",
    outline: "none",
    boxSizing: "border-box"
  },
  message: { marginBottom: "12px", fontSize: "0.95rem", fontWeight: "500" },
  btnRow: { display: "flex", gap: "12px", marginTop: "20px", width: "100%" },
  editBtn: {
    flex: 1,
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "11px 0",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "600"
  },
  saveBtn: {
    flex: 1,
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "11px 0",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "600"
  },
  cancelBtn: {
    flex: 1,
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "11px 0",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "600"
  }
};

export default OrganizerProfile;