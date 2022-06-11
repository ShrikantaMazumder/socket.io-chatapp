import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";
import "./Chat.css";

let socket;

const Chat = () => {
  const { search } = useLocation();
  const { name, room } = queryString.parse(search);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

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

    socket.on("userList", ({ roomUsers }) => {
      setUsers(roomUsers);
    });

    // disconnect socket connection when unmount this component
    return () => {
      socket.disconnect();
      socket.close();
    };
  }, []);

  const sendMessage = (e) => {
    if (e.key === "Enter" && e.target.value) {
      socket.emit("message", e.target.value);
      e.target.value = "";
    }
  };

  return (
    <div className="chat">
      <div className="user-list">
        {users.map((user, index) => (
          <div key={index}>{user.name}</div>
        ))}
      </div>
      <div className="chat-section">
        <div className="chat-head">
          <div className="room">{room}</div>
          <Link to="/">X</Link>
        </div>
        <div className="chat-box">
          <ScrollToBottom className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.user === name ? "self" : ""}`}
              >
                <span className="user">{message.user}</span>
                <span className="message-text">{message.text}</span>
              </div>
            ))}
          </ScrollToBottom>
          <input placeholder="message" onKeyDown={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
