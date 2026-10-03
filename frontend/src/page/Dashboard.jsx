import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        const storedName = localStorage.getItem("userName");

        if (storedName) {
            setUserName(storedName);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        navigate("/");
    };

    return (
        <div className="dashboard-page">

            {/* Navigation Bar */}
            <nav className="dashboard-navbar">

                <div className="dashboard-logo">
                    CampusRide
                </div>

                <div className="dashboard-nav-right">

                    <button
                        className="nav-profile-button"
                        onClick={() => navigate("/profile")}
                    >
                        👤 Profile
                    </button>

                    <button
                        className="nav-logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* Main Content */}
            <main className="dashboard-content">

                <section className="dashboard-welcome">

                    <div>
                        <p className="dashboard-small-text">
                            Welcome back
                        </p>

                        <h1>
                            Hello, {userName || "Student"} 👋
                        </h1>

                        <p>
                            Ready to make your next journey easier?
                        </p>
                    </div>

                </section>

                {/* Main Actions */}
                <section className="dashboard-actions">

                    <div
                        className="dashboard-action-card"
                        onClick={() => navigate("/find-ride")}
                    >
                        <div className="action-icon">
                            🔎
                        </div>

                        <h2>
                            Find a Ride
                        </h2>

                        <p>
                            Search for available rides
                            based on your route and date.
                        </p>

                        <button>
                            Find Ride →
                        </button>
                    </div>


                    <div
                        className="dashboard-action-card"
                        onClick={() => navigate("/offer-ride")}
                    >
                        <div className="action-icon">
                            🚗
                        </div>

                        <h2>
                            Offer a Ride
                        </h2>

                        <p>
                            Have extra seats?
                            Share your journey with others.
                        </p>

                        <button>
                            Offer Ride →
                        </button>
                    </div>

                </section>

                {/* Secondary Actions */}
                <section className="dashboard-secondary">

                    <div
                        className="dashboard-secondary-card"
                        onClick={() => navigate("/my-rides")}
                    >
                        <span>📋</span>

                        <div>
                            <h3>
                                My Rides
                            </h3>

                            <p>
                                View your rides and requests
                            </p>
                        </div>
                    </div>


                    <div
                        className="dashboard-secondary-card"
                        onClick={() => navigate("/profile")}
                    >
                        <span>👤</span>

                        <div>
                            <h3>
                                My Profile
                            </h3>

                            <p>
                                View your CampusRide profile
                            </p>
                        </div>
                    </div>

                </section>

                {/* Info Section */}
                <section className="dashboard-info">

                    <div className="info-icon">
                        💡
                    </div>

                    <div>
                        <h3>
                            How CampusRide works
                        </h3>

                        <p>
                            Offer a ride if you have empty seats,
                            or find a ride when you need one.
                            Simple, convenient and built for students.
                        </p>
                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;