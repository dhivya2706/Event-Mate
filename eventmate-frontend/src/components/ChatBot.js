import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function ChatBot({ onBookEvent }) {
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [typing, setTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {

        setChat([
            { bot: "Hello 👋 I am EventMate AI Assistant. Ask about events or booking." }
        ]);

    }, []);



    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat, typing]);

    const sendMessage = async () => {

        if (!message.trim()) return;

        const userMessage = message;

        setChat(prev => [...prev, { user: userMessage, bot: "" }]);

        setTyping(true);

        try {

            const res = await axios.post(
                "http://localhost:8080/api/chat",
                userMessage,
                { headers: { "Content-Type": "text/plain" } }
            );

            setChat(prev => {
                const updated = [...prev];

                let data = res.data;
                try {
                    data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
                } catch { }

                updated[updated.length - 1].bot = data;
                return updated;
            });

        } catch {

            setChat(prev => {
                const updated = [...prev];
                updated[updated.length - 1].bot = "⚠️ Server error";
                return updated;
            });

        }

        setTyping(false);
        setMessage("");

    };

    return (

        <div className="chatbot-panel">

            <h3>🤖 EventMate AI Assistant</h3>

            <div className="chat-box">

                {chat.map((c, i) => (

                    <div key={i} className="chat-message">

                        {c.user && (
                            <p className="user-msg"><b>You:</b> {c.user}</p>
                        )}

                        {Array.isArray(c.bot) ? (

                            <div className="chat-event-grid">

                                {c.bot.map((ev, index) => (

                                    <div key={index} className="chat-event-card">

                                        <img
                                            src={`http://localhost:8080/uploads/${ev.image}`}
                                            alt={ev.name}
                                            onError={(e) => e.target.src = "/noimage.png"}
                                        />

                                        <h4>{ev.name}</h4>

                                        <p>📅 {ev.date}</p>
                                        <p>📍 {ev.venue}</p>

                                        <p className="price">₹{ev.price}</p>

                                        <button
                                            className="book-btn"
                                            onClick={() => onBookEvent(ev )}
                                        >
                                            Book Now
                                        </button>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            c.bot && (
                                <p className="bot-msg"><b>Bot:</b> {c.bot}</p>
                            )

                        )}

                    </div>

                ))}

                {typing && (
                    <p className="bot-msg">Bot is typing...</p>
                )}

                <div ref={chatEndRef}></div>

            </div>

            <div className="chat-input">

                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about events..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                />

                <button onClick={sendMessage} disabled={typing}>
                    Send
                </button>

            </div>

        </div>

    );

}

export default ChatBot;