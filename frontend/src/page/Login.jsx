import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://campusride-production-1b98.up.railway.app/api/auth/login",
                {
                    email: email.trim(),
                    password: password
                }
            );

            console.log("LOGIN SUCCESS:", response.data);

            // Save login information
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userName", response.data.name);
            localStorage.setItem("userEmail", response.data.email);

            // Go to dashboard
            navigate("/dashboard");

        } catch (err) {
            console.error("LOGIN ERROR:", err);

            if (err.response) {

                console.error(
                    "STATUS:",
                    err.response.status
                );

                console.error(
                    "DATA:",
                    err.response.data
                );

                if (err.response.status === 401) {

                    setError(
                        "Email or password is incorrect."
                    );

                } else if (err.response.status === 403) {

                    setError(
                        "Access denied. Please check your login."
                    );

                } else if (err.response.status === 404) {

                    setError(
                        "Login API was not found."
                    );

                } else if (err.response.status === 500) {

                    setError(
                        "Server error. Please check the backend."
                    );

                } else {

                    setError(
                        `Login failed. Server returned ${err.response.status}.`
                    );
                }

            } else if (err.request) {

                console.error(
                    "NO RESPONSE FROM SERVER:",
                    err.request
                );

                setError(
                    "Cannot connect to CampusRide backend. Make sure Spring Boot is running on port 4040."
                );

            } else {

                console.error(
                    "REQUEST ERROR:",
                    err.message
                );

                setError(
                    "Something went wrong. Please try again."
                );
            }

        } finally {
            setLoading(false);
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

                {/* Title */}
                <h2>
                    Welcome Back 👋
                </h2>

                <p className="auth-subtitle">
                    Login to continue to CampusRide
                </p>

                {/* Login Form */}
                <form onSubmit={handleLogin}>

                    {/* Email */}
                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* Password */}
                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
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

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                {/* Register Link */}
                <p className="switch-auth">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create Account
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;