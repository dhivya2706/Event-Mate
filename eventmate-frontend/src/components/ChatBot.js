import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function ChatBot() {

    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        setChat([
            {
                user: "",
                bot: "Hello 👋 I am EventMate AI Assistant. Ask me about events, bookings, or payments."
            }
        ]);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const sendMessage = async () => {

        if (!message.trim()) return;

        const userMessage = message;

        try {

            const res = await axios.post(
                "http://localhost:8080/api/chat",
                  { message: userMessage },
                { headers: { "Content-Type": "application/json" } }
            );

            setChat(prev => [
                ...prev,
                { user: userMessage, bot: res.data }
            ]);

        } catch {

            setChat(prev => [
                ...prev,
                { user: userMessage, bot: "⚠️ Sorry, something went wrong." }
            ]);

        }

        setMessage("");

    };

    return (

        <div className="chatbot-panel">

            <h3>🤖 EventMate AI Assistant</h3>

            <div className="chat-box">

                {chat.map((c, i) => (
                    <div key={i} className="chat-message">

                        {c.user && (
                            <p className="user-msg">
                                <b>You:</b> {c.user}
                            </p>
                        )}

                        <p className="bot-msg">
                            <b>Bot:</b> {c.bot}
                        </p>

                    </div>
                ))}

                <div ref={chatEndRef}></div>

            </div>

            <div className="chat-input">

                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about events, booking, payment..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                />

                <button onClick={sendMessage}>
                    Send
                </button>

            </div>

        </div>

    );

}

export default ChatBot;