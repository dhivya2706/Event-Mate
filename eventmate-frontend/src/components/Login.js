import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
export default function Login() {

    const navigate = useNavigate();

    const [role, setRole] = useState("USER");

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const url =
                role === "ORGANIZER"
                    ? "http://localhost:8080/api/organizer/login"
                    : "http://localhost:8080/api/user/login";


            const res = await axios.post(url, form);

            if (res.data.message === "Login successful") {

                localStorage.setItem("user", JSON.stringify(res.data));
                localStorage.setItem("role", role);

                // ✅ ADD THIS LINE
                localStorage.setItem("email", form.email);

                if (role === "ORGANIZER")
                    navigate("/organizer");
                else
                    navigate("/user");

            }

            else {

                setMessage(res.data.message);

            }

        }

        catch {

            setMessage("Invalid Email or Password");

        }

        setLoading(false);

    };


    return (

        <div className="login-container">

            <div className="login-card">

                <div className="logo">✦</div>

                <h1>Welcome Back</h1>

                <p className="subtitle">
                    Sign in to your EventMate account
                </p>


                {/* ROLE SELECTION */}

                <div className="role-container">

                    <div
                        className={`role-box ${role === "USER" && "active"}`}
                        onClick={() => setRole("USER")}
                    >
                        <h3>User</h3>
                        <p>Browse & book events</p>
                    </div>


                    <div
                        className={`role-box ${role === "ORGANIZER" && "active"}`}
                        onClick={() => setRole("ORGANIZER")}
                    >
                        <h3>Organizer</h3>
                        <p>Create & manage events</p>
                    </div>

                </div>


                {/* FORM */}

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


                    <button>

                        {loading ? "Signing in..." : "Sign In"}

                    </button>

                </form>


                <p className="switch-text">

                    Don't have an account?
                    <span
                        onClick={() =>
                            role === "ORGANIZER"
                                ? navigate("/register")
                                : navigate("/user-register")
                        }
                    >
                        Register
                    </span>

                </p>


                <p className="message">{message}</p>


            </div>

        </div>

    );

}