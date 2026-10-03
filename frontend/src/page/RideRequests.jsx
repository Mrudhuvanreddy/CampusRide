import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function RideRequests() {
    const navigate = useNavigate();
    const { rideId } = useParams();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        loadRequests(token);
    }, [rideId, navigate]);

    const loadRequests = async (token) => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `http://localhost:4040/api/requests/ride/${rideId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRequests(response.data);

        } catch (err) {
            console.error("LOAD REQUESTS ERROR:", err);

            if (err.response) {
                setError(
                    `Unable to load requests. Server returned ${err.response.status}.`
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

    const handleAccept = async (requestId) => {
        const token = localStorage.getItem("token");

        try {
            setProcessingId(requestId);
            setError("");

            const response = await axios.put(
                `http://localhost:4040/api/requests/${requestId}/accept`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRequests((currentRequests) =>
                currentRequests.map((request) =>
                    request.id === requestId
                        ? {
                              ...request,
                              status: response.data.status
                          }
                        : request
                )
            );

        } catch (err) {
            console.error("ACCEPT REQUEST ERROR:", err);

            if (err.response) {
                setError(
                    err.response.data?.message ||
                    `Accept failed. Server returned ${err.response.status}.`
                );
            } else {
                setError("Cannot connect to CampusRide backend.");
            }
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (requestId) => {
        const token = localStorage.getItem("token");

        try {
            setProcessingId(requestId);
            setError("");

            const response = await axios.put(
                `http://localhost:4040/api/requests/${requestId}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRequests((currentRequests) =>
                currentRequests.map((request) =>
                    request.id === requestId
                        ? {
                              ...request,
                              status: response.data.status
                          }
                        : request
                )
            );

        } catch (err) {
            console.error("REJECT REQUEST ERROR:", err);

            if (err.response) {
                setError(
                    err.response.data?.message ||
                    `Reject failed. Server returned ${err.response.status}.`
                );
            } else {
                setError("Cannot connect to CampusRide backend.");
            }
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="ride-requests-page">

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
                    onClick={() => navigate("/my-rides")}
                >
                    ← My Rides
                </button>

            </nav>

            {/* Main */}

            <main className="ride-requests-content">

                <div className="ride-requests-heading">

                    <h1>
                        Ride Requests 📩
                    </h1>

                    <p>
                        Manage passengers who want to join
                        Ride #{rideId}.
                    </p>

                </div>

                {loading && (
                    <div className="loading-message">
                        Loading requests...
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!loading && !error && requests.length === 0 && (
                    <div className="empty-card">

                        <div>📭</div>

                        <h3>
                            No requests yet
                        </h3>

                        <p>
                            Passenger requests for this ride
                            will appear here.
                        </p>

                    </div>
                )}

                {!loading && requests.length > 0 && (
                    <section className="requests-list">

                        {requests.map((request) => (

                            <div
                                className="driver-request-card"
                                key={request.id}
                            >

                                <div className="passenger-info">

                                    <div className="passenger-avatar">
                                        👤
                                    </div>

                                    <div>
                                        <h3>
                                            {request.passengerName}
                                        </h3>

                                        <p>
                                            {request.passengerEmail}
                                        </p>

                                        <small>
                                            Request #{request.id}
                                        </small>
                                    </div>

                                </div>

                                <div className="driver-request-actions">

                                    <span
                                        className={`request-status ${request.status.toLowerCase()}`}
                                    >
                                        {request.status}
                                    </span>

                                    {request.status === "PENDING" && (
                                        <div className="request-action-buttons">

                                            <button
                                                className="accept-button"
                                                disabled={
                                                    processingId === request.id
                                                }
                                                onClick={() =>
                                                    handleAccept(request.id)
                                                }
                                            >
                                                {processingId === request.id
                                                    ? "Processing..."
                                                    : "Accept"}
                                            </button>

                                            <button
                                                className="reject-button"
                                                disabled={
                                                    processingId === request.id
                                                }
                                                onClick={() =>
                                                    handleReject(request.id)
                                                }
                                            >
                                                Reject
                                            </button>

                                        </div>
                                    )}

                                </div>

                            </div>

                        ))}

                    </section>
                )}

            </main>

        </div>
    );
}

export default RideRequests;