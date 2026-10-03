import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        loadProfile(token);
    }, [navigate]);

    const loadProfile = async (token) => {
        try {
            const response = await axios.get(
                "https://campusride-production-1b98.up.railway.app/api/users/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("PROFILE:", response.data);

            setProfile(response.data);

        } catch (err) {
            console.error("PROFILE ERROR:", err);

            if (err.response) {
                setError(
                    `Unable to load profile. Server returned ${err.response.status}.`
                );
            } else {
                setError(
                    "Cannot connect to CampusRide backend."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        navigate("/");
    };

    return (
        <div className="profile-page">

            {/* Navbar */}

            <nav className="ride-navbar">

                <div
                    className="ride-logo"
                    onClick={() => navigate("/dashboard")}
                >
                    CampusRide
                </div>

                <div className="profile-nav-buttons">

                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Dashboard
                    </button>

                    <button
                        className="profile-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* Content */}

            <main className="profile-content">

                <div className="profile-heading">

                    <div className="profile-big-icon">
                        👤
                    </div>

                    <div>
                        <h1>My Profile</h1>

                        <p>
                            View your CampusRide account information.
                        </p>
                    </div>

                </div>

                {loading && (
                    <div className="loading-message">
                        Loading profile...
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!loading && !error && profile && (

                    <div className="profile-card">

                        <div className="profile-avatar">
                            👤
                        </div>

                        <div className="profile-info">

                            <div className="profile-field">

                                <span>
                                    Full Name
                                </span>

                                <strong>
                                    {profile.name}
                                </strong>

                            </div>

                            <div className="profile-field">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {profile.email}
                                </strong>

                            </div>

                            <div className="profile-field">

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {profile.phone || "Not provided"}
                                </strong>

                            </div>

                            <div className="profile-field">

                                <span>
                                    User ID
                                </span>

                                <strong>
                                    #{profile.id}
                                </strong>

                            </div>

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

export default Profile;