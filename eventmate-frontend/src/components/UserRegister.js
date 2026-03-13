import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserRegister() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""

    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleRegister = async (e) => {

        e.preventDefault();

        if (form.password !== form.confirmPassword) {

            setMessage("Passwords do not match");

            return;

        }

        try {

            await axios.post(

                "http://localhost:8080/api/user/register",

                {

                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    password: form.password

                }

            );

            setMessage("Registration Successful");

            setTimeout(() => {

                navigate("/login");

            }, 1500);

        }

        catch {

            setMessage("Registration failed");

        }

    };

    return (

        <div className="register-container">

            <div className="register-card">

                <h1>User Register</h1>

                <form onSubmit={handleRegister}>

                    <input name="name" placeholder="Name" onChange={handleChange} required />

                    <input name="email" placeholder="Email" onChange={handleChange} required />

                    <input name="phone" placeholder="Phone" onChange={handleChange} required />

                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

                    <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />

                    <button>Register</button>

                </form>

                <p>{message}</p>

                <p className="switch-text">
                    Already have account?
                    <span className="switch-link" onClick={() => navigate("/login")}>
                        Login
                    </span>
                </p>

            </div>

        </div>

    );

}