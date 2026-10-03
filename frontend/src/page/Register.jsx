import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");

        try {
            await axios.post(
                "http://localhost:4040/api/auth/register",
                {
                    name,
                    email,
                    password,
                    phone
                }
            );

            alert("Registration successful!");

            navigate("/");

        } catch (err) {
            setError(
                "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* Header */}
                <div className="auth-header">

                    <Link
                        to="/?splash=1"
                        className="campusride-logo-link"
                    >
                        <h1>CampusRide</h1>
                    </Link>

                    <p>
                        Ride together. Travel smarter.
                    </p>

                </div>

                <h2>
                    Create Account 🚗
                </h2>

                <p className="auth-subtitle">
                    Join your college ride-sharing community
                </p>

                <form onSubmit={handleRegister}>

                    {/* Name */}
                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* Email */}
                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* Phone */}
                    <div className="form-group">

                        <label>
                            Phone
                        </label>

                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* Password */}
                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* Error */}
                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="primary-button"
                    >
                        Create Account
                    </button>

                </form>

                <p className="switch-auth">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;