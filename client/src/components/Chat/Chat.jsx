import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./Chat.css";

let socket;

const Chat = () => {
  const { search } = useLocation();
  const { name, room } = queryString.parse(search);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    socket = io("http://localhost:4000");
    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    socket.on("message", (message) => {
      setMessages((existingMessages) => [...existingMessages, message]);
    });
  }, []);

  const sendMessage = (e) => {
    if (e.key === "Enter" && e.target.value) {
      socket.emit("message", e.target.value);
      e.target.value = "";
    }
  };

  return (
    <div className="chat">
      <div className="chat-head">
        <div className="room">{room}</div>
        <Link to="/">X</Link>
      </div>
      <div className="chat-box">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              {message.user}: {message.text}
            </div>
          ))}
        </div>
        <input placeholder="message" onKeyDown={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
