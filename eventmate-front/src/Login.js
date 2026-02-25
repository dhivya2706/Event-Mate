import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

function Login({ switchToRegister, setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/users/login", {
        email,
        password,
      });

      const user = res.data;

      // Save to localStorage
      localStorage.setItem("adminRole",  user.role);
      localStorage.setItem("adminEmail", user.email);
      localStorage.setItem("adminName",  user.name || "");

      setCurrentUser(user);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-body">
      <div className="login-card">

        {/* Logo / Title */}
        <div className="login-logo">
          <h2>EVENTMATE</h2>
          <p>Smart AI Event Planner</p>
        </div>

        {/* Error */}
        {error && <div className="login-error">{error}</div>}

        {/* Inputs */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Login Button */}
        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Social Login */}
        <div className="login-divider">Or login with</div>
        <div className="social-icons">
          <button title="Google">G</button>
          <button title="GitHub">⌥</button>
          <button title="LinkedIn">in</button>
        </div>

        {/* Register Link */}
        <div className="login-footer">
          Don't have an account?{" "}
          <span onClick={switchToRegister}>Register</span>
        </div>

      </div>
    </div>
  );
}

export default Login;