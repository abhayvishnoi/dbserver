const express = require("express");
const { getRows, createRows } = require("./controller/main");
const router = express.Router();
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
router.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});
router.get("/sales", getRows);
router.post("/sales", createRows);
app.use(router);
function startEmitting(socket) {
  setInterval(() => {
    socket.emit("broadcast", { message: new Date() });
  }, 500);
}
io.on("connection", (socket) => {
  console.log("user connected");
  startEmitting(socket);
  socket.on("chat", (msg) => {
    io.emit("chat", msg);
  });
  // socket.emit("broadcast", { message: "hello" });
});

server.listen(5000);
console.log("Listening on http://localhost:5000");
