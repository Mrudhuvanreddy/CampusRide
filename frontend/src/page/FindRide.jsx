import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FindRide() {
    const navigate = useNavigate();

    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [rideDate, setRideDate] = useState("");

    const [rides, setRides] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setRides([]);
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        try {
            const response = await axios.get(
                "https://campusride-production-1b98.up.railway.app/api/rides/search",
                {
                    params: {
                        source: source.trim(),
                        destination: destination.trim(),
                        rideDate: rideDate
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("SEARCH RESULT:", response.data);

            setRides(response.data);

            if (response.data.length === 0) {
                setMessage("No rides found for your search.");
            }

        } catch (err) {
            console.error("SEARCH RIDE ERROR:", err);

            if (err.response) {
                setError(
                    `Search failed. Server returned ${err.response.status}.`
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

    const requestRide = async (rideId) => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        try {
            const response = await axios.post(
                `https://campusride-production-1b98.up.railway.app/api/requests/${rideId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(
                `Ride request sent successfully! Request ID: ${response.data.id}`
            );

        } catch (err) {
            console.error("REQUEST RIDE ERROR:", err);

            if (err.response) {
                alert(
                    `Request failed. Server returned ${err.response.status}.`
                );
            } else {
                alert("Cannot connect to CampusRide backend.");
            }
        }
    };

    return (
        <div className="find-ride-page">

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

            {/* Content */}
            <main className="find-ride-content">

                <div className="find-ride-header">

                    <div className="find-ride-icon">
                        🔎
                    </div>

                    <div>
                        <h1>Find a Ride</h1>

                        <p>
                            Search for students travelling on
                            the same route.
                        </p>
                    </div>

                </div>

                {/* Search Form */}
                <div className="search-card">

                    <form onSubmit={handleSearch}>

                        <div className="search-row">

                            <div className="form-group">

                                <label>
                                    Starting Point
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Anurag University"
                                    value={source}
                                    onChange={(e) =>
                                        setSource(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Destination
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Kukatpally"
                                    value={destination}
                                    onChange={(e) =>
                                        setDestination(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>

                        <div className="search-bottom">

                            <div className="form-group">

                                <label>
                                    Ride Date
                                </label>

                                <input
                                    type="date"
                                    value={rideDate}
                                    onChange={(e) =>
                                        setRideDate(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="primary-button search-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Searching..."
                                    : "Search Rides 🔎"}
                            </button>

                        </div>

                    </form>

                </div>

                {/* Error */}
                {error && (
                    <div className="error-message find-message">
                        {error}
                    </div>
                )}

                {/* Message */}
                {message && !error && (
                    <div className="find-info-message">
                        {message}
                    </div>
                )}

                {/* Results */}
                {rides.length > 0 && (

                    <section className="ride-results">

                        <h2>
                            Available Rides
                        </h2>

                        <p className="results-subtitle">
                            {rides.length} ride(s) found
                        </p>

                        {rides.map((ride) => {

                            const totalPeople =
                                ride.availableSeats + 1;

                            const estimatedShare =
                                totalPeople > 0
                                    ? ride.totalExpense / totalPeople
                                    : ride.totalExpense;

                            return (
                                <div
                                    className="ride-result-card"
                                    key={ride.id}
                                >

                                    <div className="ride-result-main">

                                        <div className="route-section">

                                            <div className="route-point">

                                                <span>📍</span>

                                                <div>

                                                    <small>
                                                        From
                                                    </small>

                                                    <strong>
                                                        {ride.source}
                                                    </strong>

                                                </div>

                                            </div>

                                            <div className="route-line">
                                                ↓
                                            </div>

                                            <div className="route-point">

                                                <span>📍</span>

                                                <div>

                                                    <small>
                                                        To
                                                    </small>

                                                    <strong>
                                                        {ride.destination}
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="ride-details">

                                            <div>
                                                <span>👤 Driver</span>
                                                <strong>
                                                    {ride.driverName}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>📅 Date</span>
                                                <strong>
                                                    {ride.rideDate}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>🕐 Time</span>
                                                <strong>
                                                    {ride.rideTime}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>💺 Seats</span>
                                                <strong>
                                                    {ride.availableSeats}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>💰 Total Expense</span>
                                                <strong>
                                                    ₹{ride.totalExpense}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>💸 Estimated Share</span>
                                                <strong>
                                                    ₹{estimatedShare.toFixed(2)}
                                                </strong>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="ride-result-footer">

                                        <span className="ride-status">
                                            {ride.status}
                                        </span>

                                        {ride.availableSeats > 0 &&
                                            ride.status === "ACTIVE" && (

                                                <button
                                                    className="request-button"
                                                    onClick={() =>
                                                        requestRide(ride.id)
                                                    }
                                                >
                                                    Request Ride
                                                </button>

                                            )}

                                    </div>

                                </div>
                            );
                        })}

                    </section>

                )}

            </main>

        </div>
    );
}

export default FindRide;