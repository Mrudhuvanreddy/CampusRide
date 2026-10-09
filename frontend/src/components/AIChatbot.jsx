import { useState } from "react";
import "./AIChatbot.css";

const API_URL =
    "https://campusride-production-1b98.up.railway.app";

function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hey! 👋 I'm CampusRide AI. Ask me about ride booking, carpooling, or ride safety."
        }
    ]);

    const sendMessage = async (event) => {
        event.preventDefault();

        const text = message.trim();

        if (!text || loading) return;

        const token = localStorage.getItem("token");

        if (!token) {
            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    text: "Please log in to use CampusRide AI."
                }
            ]);
            setMessage("");
            return;
        }

        setMessages((previous) => [
            ...previous,
            { role: "user", text }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/ai/chat`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ message: text })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || `Request failed (${response.status})`
                );
            }

            if (!data.reply) {
                throw new Error("The AI returned no response.");
            }

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    text: data.reply
                }
            ]);
        } catch (error) {
            console.error("CampusRide AI error:", error);

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    text: "Sorry, I couldn't connect to the AI assistant. Please try again later."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <section
                    className="campus-ai-window"
                    aria-label="CampusRide AI chatbot"
                >
                    <header className="campus-ai-header">
                        <div>
                            <strong>CampusRide AI 🤖</strong>
                            <div className="campus-ai-status">
                                Your personal ride assistant
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chatbot"
                        >
                            ✕
                        </button>
                    </header>

                    <div className="campus-ai-messages">
                        {messages.map((item, index) => (
                            <div
                                key={index}
                                className={`campus-ai-message ${item.role}`}
                            >
                                {item.text}
                            </div>
                        ))}

                        {loading && (
                            <div className="campus-ai-message assistant">
                                Thinking...
                            </div>
                        )}
                    </div>

                    <form
                        className="campus-ai-form"
                        onSubmit={sendMessage}
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            placeholder="Ask CampusRide AI..."
                            maxLength={2000}
                            aria-label="Enter your message"
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            disabled={loading || !message.trim()}
                        >
                            {loading ? "..." : "Send"}
                        </button>
                    </form>
                </section>
            )}

            <button
                type="button"
                className="campus-ai-toggle"
                onClick={() =>
                    setIsOpen((previous) => !previous)
                }
                aria-label={
                    isOpen ? "Close AI assistant" : "Open AI assistant"
                }
            >
                {isOpen ? "✕" : "💬"}
            </button>
        </>
    );
}

export default AIChatbot;