import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Chat() {
    const { rideId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const API_URL =
        "https://campusride-production-1b98.up.railway.app";

    const getMessages = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/chat/${rideId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessages(response.data);
            setError("");
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load chat."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        getMessages();
    }, [rideId]);

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            return;
        }

        try {
            setSending(true);

            const response = await axios.post(
                `${API_URL}/api/chat/${rideId}`,
                {
                    message: message.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessages((previousMessages) => [
                ...previousMessages,
                response.data,
            ]);

            setMessage("");
            setError("");
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to send message."
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: "30px 20px",
            }}
        >
            <div
                style={{
                    maxWidth: "700px",
                    margin: "0 auto",
                    background: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                }}
            >
                {/* Header */}

                <div
                    style={{
                        padding: "20px",
                        background: "#111827",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "22px",
                            }}
                        >
                            Ride Chat
                        </h2>

                        <p
                            style={{
                                margin: "5px 0 0",
                                fontSize: "13px",
                                opacity: 0.8,
                            }}
                        >
                            Ride #{rideId}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            border: "none",
                            background: "white",
                            color: "#111827",
                            padding: "8px 14px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
                    >
                        Back
                    </button>
                </div>

                {/* Messages */}

                <div
                    style={{
                        height: "500px",
                        overflowY: "auto",
                        padding: "20px",
                        background: "#f9fafb",
                    }}
                >
                    {loading ? (
                        <p
                            style={{
                                textAlign: "center",
                                color: "#666",
                            }}
                        >
                            Loading chat...
                        </p>
                    ) : error ? (
                        <div
                            style={{
                                textAlign: "center",
                                color: "#dc2626",
                                padding: "30px 10px",
                            }}
                        >
                            {error}
                        </div>
                    ) : messages.length === 0 ? (
                        <p
                            style={{
                                textAlign: "center",
                                color: "#777",
                                marginTop: "180px",
                            }}
                        >
                            No messages yet.
                            <br />
                            Start the conversation!
                        </p>
                    ) : (
                        messages.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    marginBottom: "15px",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        color: "#555",
                                        marginBottom: "4px",
                                    }}
                                >
                                    {item.senderName}
                                </div>

                                <div
                                    style={{
                                        display: "inline-block",
                                        background: "#ffffff",
                                        border: "1px solid #e5e7eb",
                                        padding: "10px 14px",
                                        borderRadius: "12px",
                                        maxWidth: "80%",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {item.message}
                                </div>

                                <div
                                    style={{
                                        fontSize: "10px",
                                        color: "#999",
                                        marginTop: "3px",
                                    }}
                                >
                                    {item.sentAt
                                        ? new Date(
                                              item.sentAt
                                          ).toLocaleString()
                                        : ""}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Message Input */}

                <form
                    onSubmit={sendMessage}
                    style={{
                        display: "flex",
                        gap: "10px",
                        padding: "15px",
                        borderTop: "1px solid #e5e7eb",
                        background: "#ffffff",
                    }}
                >
                    <input
                        type="text"
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        placeholder="Type your message..."
                        maxLength={1000}
                        disabled={sending}
                        style={{
                            flex: 1,
                            padding: "12px 14px",
                            border: "1px solid #d1d5db",
                            borderRadius: "10px",
                            outline: "none",
                            fontSize: "14px",
                        }}
                    />

                    <button
                        type="submit"
                        disabled={
                            sending ||
                            !message.trim()
                        }
                        style={{
                            padding: "12px 20px",
                            border: "none",
                            borderRadius: "10px",
                            background: "#111827",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
                    >
                        {sending ? "Sending..." : "Send"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;