import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Chatbot.module.css";

function Chatbot() {

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 Ask me about events!" }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };

    setMessages(prev => [...prev, userMessage]);

    try {

      const res = await axios.post(
        "http://localhost:8080/api/chatbot",
        { message: input }
      );

      const botMessage = {
        sender: "bot",
        text: res.data.reply
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      console.error(err);
    }

    setInput("");
  };

  return (
    <div className={styles.chatbot}>

      <h3>AI Assistant 🤖</h3>

      <div className={styles.messages}>

        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.sender === "user"
                ? styles.userMessage
                : styles.botMessage
            }
          >
            {m.text}
          </div>
        ))}

      </div>

      <div className={styles.inputArea}>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about events..."
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}

export default Chatbot;