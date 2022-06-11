const express = require("express");
const socketIO = require("socket.io");
const http = require("http")
const cors = require("cors");

const app = express();
const port = 4000;

app.use(cors());

const httpServer = http.createServer(app)
const io = socketIO(httpServer);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("A user connected ", socket.id);

  socket.on("disconnect", () => {
    console.log('user disconnected', socket.id);
  })
})

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
