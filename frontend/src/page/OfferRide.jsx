import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OfferRide() {
    const navigate = useNavigate();

    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [rideDate, setRideDate] = useState("");
    const [rideTime, setRideTime] = useState("");
    const [availableSeats, setAvailableSeats] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        try {
            const response = await axios.post(
                "https://campusride-production-1b98.up.railway.app/api/rides",
                {
                    source: source.trim(),
                    destination: destination.trim(),
                    rideDate: rideDate,
                    rideTime: rideTime,
                    availableSeats: Number(availableSeats)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("RIDE CREATED:", response.data);

            setMessage(
                `Ride created successfully! Ride ID: ${response.data.id}`
            );

            setSource("");
            setDestination("");
            setRideDate("");
            setRideTime("");
            setAvailableSeats("");

        } catch (err) {
            console.error("OFFER RIDE ERROR:", err);

            if (err.response) {
                setError(
                    `Failed to create ride. Server returned ${err.response.status}.`
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

    return (
        <div className="ride-page">

            {/* Navbar */}
            <nav className="ride-navbar">

                <div
                    className="ride-logo"
                    onClick={() => navigate("/dashboard")}
                >
                    CampusRide
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </nav>

            {/* Main */}
            <main className="ride-content">

                <div className="ride-card">

                    <div className="ride-header">

                        <div className="ride-header-icon">
                            🚗
                        </div>

                        <div>
                            <h1>Offer a Ride</h1>

                            <p>
                                Share your journey and help another
                                student travel with you.
                            </p>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* Source */}
                        <div className="form-group">

                            <label htmlFor="source">
                                Starting Point
                            </label>

                            <input
                                id="source"
                                type="text"
                                placeholder="e.g. Anurag University"
                                value={source}
                                onChange={(e) =>
                                    setSource(e.target.value)
                                }
                                required
                            />

                        </div>

                        {/* Destination */}
                        <div className="form-group">

                            <label htmlFor="destination">
                                Destination
                            </label>

                            <input
                                id="destination"
                                type="text"
                                placeholder="e.g. Kukatpally"
                                value={destination}
                                onChange={(e) =>
                                    setDestination(e.target.value)
                                }
                                required
                            />

                        </div>

                        {/* Date + Time */}
                        <div className="ride-row">

                            <div className="form-group">

                                <label htmlFor="rideDate">
                                    Ride Date
                                </label>

                                <input
                                    id="rideDate"
                                    type="date"
                                    value={rideDate}
                                    onChange={(e) =>
                                        setRideDate(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="rideTime">
                                    Ride Time
                                </label>

                                <input
                                    id="rideTime"
                                    type="time"
                                    value={rideTime}
                                    onChange={(e) =>
                                        setRideTime(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>

                        {/* Seats */}
                        <div className="form-group">

                            <label htmlFor="availableSeats">
                                Available Seats
                            </label>

                            <input
                                id="availableSeats"
                                type="number"
                                min="1"
                                max="10"
                                placeholder="Number of seats"
                                value={availableSeats}
                                onChange={(e) =>
                                    setAvailableSeats(e.target.value)
                                }
                                required
                            />

                        </div>

                        {/* Success */}
                        {message && (
                            <div className="success-message">
                                {message}
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="primary-button ride-submit-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Ride..."
                                : "Offer Ride 🚗"}
                        </button>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default OfferRide;