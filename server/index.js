const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const cors = require("cors");
const { addUser, removeUser, getUserById, getRoomUsers } = require("./users");

const app = express();
const port = 4000;

app.use(cors());

const httpServer = http.createServer(app);
const io = socketIO(httpServer);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) {
      callback(error);
    }

    // create a room/group on socket server
    socket.join(room);
    socket.emit("message", {
      user: "System",
      text: `Welcome ${name} to ${room}.`,
    });
    socket.broadcast.to(room).emit("message", {
      user: "System",
      text: `${name} just joined to ${room}.`,
    });

    // get current room users
    const roomUsers = getRoomUsers(room);
    io.to(room).emit("userList", {
      roomUsers,
    });
    callback();
  });

  socket.on("message", (message) => {
    const user = getUserById(socket.id);
    // since this message should go to group and same for msg sender and others
    // we should use io
    io.to(user.room).emit("message", {
      user: user.name,
      text: message,
    });
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      // since socket is disconnected, we can't use socket here.
      // we shoul use io
      io.to(user.room).emit("message", {
        user: "System",
        text: `${user.name} left the room.`,
      });

      // get current room users
      const roomUsers = getRoomUsers(user.room);
      io.to(user.room).emit("userList", {
        roomUsers,
      });
    }
    
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
