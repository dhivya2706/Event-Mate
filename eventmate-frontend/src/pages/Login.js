import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/users/login",
        { email, password, role },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Backend response:", response.data);

      const { status, role: userRole } = response.data;

      if (status === "success") {
        // ✅ Store email & role
        localStorage.setItem("email", email);
        localStorage.setItem("role", userRole);

        // ✅ Username = part before "@"
        const usernameFromEmail = email.split("@")[0];
        localStorage.setItem("username", usernameFromEmail);

        // ✅ Navigate based on role
        if (userRole === "user") {
          navigate("/dashboard", {
            state: { username: usernameFromEmail }, // optional but good
            replace: true,
          });
        } else if (userRole === "admin") {
          alert("Admin logged in — admin panel coming soon!");
        } else if (userRole === "organizer") {
          alert("Organizer logged in — organizer panel coming soon!");
        }
      } else {
        alert("Invalid credentials or wrong role!");
      }
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message || "Invalid credentials!");
      } else if (error.request) {
        alert(
          "Cannot connect to server. Make sure backend is running on port 8080."
        );
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.title}>EventMate Login</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
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
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.signupText}>
          New user? <a href="/signup" style={styles.link}>Sign up</a>
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
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "450px",
    padding: "40px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
  },
  title: {
    textAlign: "center",
    color: "#667eea",
    marginBottom: "30px",
    fontSize: "28px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "border 0.2s",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "17px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s",
    marginTop: "10px",
  },
  signupText: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;