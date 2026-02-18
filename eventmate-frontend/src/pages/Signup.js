import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // ✅ Password validation: min 8 chars, uppercase, lowercase, number, special char
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/users/signup",
        { name, email, password, role }
      );

      if (response.data.status === "success") {
        alert("Signup successful! Please login.");
        navigate("/");
      } else {
        alert(response.data.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.title}>EventMate Signup</h2>

        <input
          type="text"
          placeholder="Enter Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.input}
          required
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="organizer">Organizer</option>
          <option value="admin">Admin</option>
        </select>

        <button style={styles.button} onClick={handleSignup}>
          Sign Up
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #7b5fff, #00d4ff)",
  },
  card: {
    width: "450px",
    padding: "40px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  title: {
    textAlign: "center",
    color: "#004aad",
    marginBottom: "8px",
    fontSize: "24px",
    fontFamily: "Arial, sans-serif",
  },
  input: {
    padding: "14px 18px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #bbb",
    outline: "none",
  },
  button: {
    padding: "14px",
    fontSize: "17px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#004aad",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Signup;
