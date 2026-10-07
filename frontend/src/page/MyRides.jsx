import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyRides() {
    const navigate = useNavigate();

    const [offeredRides, setOfferedRides] = useState([]);
    const [myRequests, setMyRequests] = useState([]);

    const [expenseData, setExpenseData] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        loadMyRides(token);
    }, [navigate]);

    const loadMyRides = async (token) => {
        try {
            setLoading(true);
            setError("");

            /*
             * Get all rides.
             * The backend currently provides GET /api/rides,
             * so we filter the rides belonging to the logged-in user.
             */

            const ridesResponse = await axios.get(
                "https://campusride-production-1b98.up.railway.app/api/rides",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const email = localStorage.getItem("userEmail");

            const myOfferedRides =
                ridesResponse.data.filter(
                    (ride) => ride.driverEmail === email
                );

            setOfferedRides(myOfferedRides);

            /*
             * Get passenger requests.
             */

            const requestsResponse = await axios.get(
                "https://campusride-production-1b98.up.railway.app/api/requests/my-requests",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMyRequests(requestsResponse.data);

            /*
             * Get expense information for rides
             * where the current user is a participant.
             */

            const expenseResults = {};

            // Driver's offered rides
            for (const ride of myOfferedRides) {
                try {
                    const expenseResponse = await axios.get(
                        `https://campusride-production-1b98.up.railway.app/api/requests/${ride.id}/expense`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    let data = expenseResponse.data;

                    if (typeof data === "string") {
                        data = JSON.parse(data);
                    }

                    expenseResults[ride.id] = data;

                } catch (expenseError) {
                    console.log(
                        `Expense not available for ride ${ride.id}`
                    );
                }
            }

            // Passenger's accepted rides
            for (const request of requestsResponse.data) {

                if (request.status !== "ACCEPTED") {
                    continue;
                }

                try {
                    const expenseResponse = await axios.get(
                        `https://campusride-production-1b98.up.railway.app/api/requests/${request.rideId}/expense`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    let data = expenseResponse.data;

                    if (typeof data === "string") {
                        data = JSON.parse(data);
                    }

                    expenseResults[request.rideId] = data;

                } catch (expenseError) {
                    console.log(
                        `Expense not available for ride ${request.rideId}`
                    );
                }
            }

            setExpenseData(expenseResults);

        } catch (err) {
            console.error("MY RIDES ERROR:", err);

            if (err.response) {
                setError(
                    `Unable to load your rides. Server returned ${err.response.status}.`
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
        <div className="my-rides-page">

            {/* Navbar */}

            <nav className="ride-navbar">

                <div
                    className="ride-logo"
                    onClick={() => navigate("/dashboard")}
                >
                    CampusRide
                </div>

                <div className="my-rides-nav-buttons">

                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Dashboard
                    </button>

                    <button
                        className="my-rides-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* Main Content */}

            <main className="my-rides-content">

                <div className="my-rides-heading">

                    <h1>
                        My Rides 📋
                    </h1>

                    <p>
                        Manage the rides you offer and the
                        requests you have made.
                    </p>

                </div>

                {loading && (
                    <div className="loading-message">
                        Loading your rides...
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!loading && !error && (

                    <>

                        {/* Offered Rides */}

                        <section className="rides-section">

                            <div className="section-heading">

                                <h2>
                                    🚗 Rides I Offer
                                </h2>

                                <span>
                                    {offeredRides.length}
                                </span>

                            </div>

                            {offeredRides.length === 0 ? (

                                <div className="empty-card">

                                    <div>
                                        🚗
                                    </div>

                                    <h3>
                                        No rides offered yet
                                    </h3>

                                    <p>
                                        Have empty seats?
                                        Offer a ride to other students.
                                    </p>

                                    <button
                                        className="primary-button"
                                        onClick={() =>
                                            navigate("/offer-ride")
                                        }
                                    >
                                        Offer a Ride
                                    </button>

                                </div>

                            ) : (

                                offeredRides.map((ride) => {

                                    const expense =
                                        expenseData[ride.id];

                                    return (
                                        <div
                                            className="my-ride-card"
                                            key={ride.id}
                                        >

                                            <div className="my-ride-route">

                                                <div>

                                                    <small>
                                                        FROM
                                                    </small>

                                                    <strong>
                                                        {ride.source}
                                                    </strong>

                                                </div>

                                                <span>
                                                    →
                                                </span>

                                                <div>

                                                    <small>
                                                        TO
                                                    </small>

                                                    <strong>
                                                        {ride.destination}
                                                    </strong>

                                                </div>

                                            </div>

                                            <div className="my-ride-info">

                                                <div>
                                                    <span>
                                                        📅 Date
                                                    </span>

                                                    <strong>
                                                        {ride.rideDate}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        🕐 Time
                                                    </span>

                                                    <strong>
                                                        {ride.rideTime}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        💺 Seats
                                                    </span>

                                                    <strong>
                                                        {ride.availableSeats}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        💰 Total Expense
                                                    </span>

                                                    <strong>
                                                        ₹{ride.totalExpense}
                                                    </strong>
                                                </div>

                                                {expense && (
                                                    <div>
                                                        <span>
                                                            💸 Your Share
                                                        </span>

                                                        <strong>
                                                            ₹{expense.sharePerPerson}
                                                        </strong>
                                                    </div>
                                                )}

                                                <div>
                                                    <span>
                                                        Status
                                                    </span>

                                                    <strong className="status-active">
                                                        {ride.status}
                                                    </strong>
                                                </div>

                                            </div>

                                            <button
                                                className="view-requests-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/ride-requests/${ride.id}`
                                                    )
                                                }
                                            >
                                                View Requests →
                                            </button>

                                        </div>
                                    );
                                })

                            )}

                        </section>


                        {/* Passenger Requests */}

                        <section className="rides-section">

                            <div className="section-heading">

                                <h2>
                                    🧑 Rides I Requested
                                </h2>

                                <span>
                                    {myRequests.length}
                                </span>

                            </div>

                            {myRequests.length === 0 ? (

                                <div className="empty-card">

                                    <div>
                                        🔎
                                    </div>

                                    <h3>
                                        No ride requests yet
                                    </h3>

                                    <p>
                                        Find a ride that matches
                                        your route and request a seat.
                                    </p>

                                    <button
                                        className="primary-button"
                                        onClick={() =>
                                            navigate("/find-ride")
                                        }
                                    >
                                        Find a Ride
                                    </button>

                                </div>

                            ) : (

                                myRequests.map((request) => {

                                    const expense =
                                        expenseData[request.rideId];

                                    return (
                                        <div
                                            className="request-card"
                                            key={request.id}
                                        >

                                            <div className="request-route">

                                                <div>

                                                    <small>
                                                        RIDE
                                                    </small>

                                                    <strong>
                                                        #{request.rideId}
                                                    </strong>

                                                </div>

                                                <div>

                                                    <small>
                                                        PASSENGER
                                                    </small>

                                                    <strong>
                                                        {request.passengerName}
                                                    </strong>

                                                </div>

                                            </div>

                                            <div>

                                                <span className="request-label">
                                                    Request Status
                                                </span>

                                                <span
                                                    className={`request-status ${request.status.toLowerCase()}`}
                                                >
                                                    {request.status}
                                                </span>

                                            </div>

                                            {request.status === "ACCEPTED" &&
                                                expense && (

                                                    <div className="ride-expense-info">

                                                        <div>
                                                            <span>
                                                                💰 Total Ride Expense
                                                            </span>

                                                            <strong>
                                                                ₹{expense.totalExpense}
                                                            </strong>
                                                        </div>

                                                        <div>
                                                            <span>
                                                                👥 Total People
                                                            </span>

                                                            <strong>
                                                                {expense.totalPeople}
                                                            </strong>
                                                        </div>

                                                        <div>
                                                            <span>
                                                                💸 Your Share
                                                            </span>

                                                            <strong>
                                                                ₹{expense.sharePerPerson}
                                                            </strong>
                                                        </div>

                                                    </div>

                                                )}

                                        </div>
                                    );
                                })

                            )}

                        </section>

                    </>

                )}

            </main>

        </div>
    );
}

export default MyRides;