const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const cors = require("cors");
const { addUser, removeUser } = require("./users");

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
    console.log("Join request", name);
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
      text: `${name} just joined to ${room}.`
    })
    callback()
  });

  socket.on("message",  (message) => {
    console.log(message);
  })

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    removeUser(socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
