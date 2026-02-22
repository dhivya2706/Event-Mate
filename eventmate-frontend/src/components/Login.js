import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:8080/api/organizer/login",
                form
            );

            if (res.data.message === "Login successful") {

                localStorage.setItem("organizer", JSON.stringify(res.data));
                localStorage.setItem("email", res.data.email);
                localStorage.setItem("name", res.data.name);
                localStorage.setItem("role", res.data.role);

                navigate("/organizer");

            } else {
                setMessage(res.data.message);
            }

        } catch (err) {
            console.error(err);
            setMessage("Invalid email or password");
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>EventMate AI Scheduler</h1>
                <p className="subtitle">Smart AI Event Planner</p>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="social-login">
                    <p>Or login with</p>
                    <div className="social-icons">
                        <FaGoogle />
                        <FaGithub />
                        <FaLinkedin />
                    </div>
                </div>

                <p className="switch-text">
                    Don't have an account?{" "}
                    <span
                        className="switch-link"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </span>
                </p>

                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}