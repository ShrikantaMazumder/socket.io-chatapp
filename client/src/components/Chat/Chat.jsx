import queryString from "query-string";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

let socket;

const Chat = () => {
  const { search } = useLocation();
  const { name, room } = queryString.parse(search);
  console.log(name, room);
  useEffect(() => {
    socket = io("http://localhost:4000");
    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, []);

  return <div className="chat">chat</div>;
};

export default Chat;
