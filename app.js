import express from "express";
import http from "http";
import io from "socket.io";
import handlebars from "express-handlebars";

const app = express();
http.createServer(app);
const socket = io(http);

app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");

socket.on("connection", (socket) => {
  console.log(" connected");
});

app.get("/", (req, res) => {
  socket.emit("event", {
    someProperty: "some value",
    otherProperty: "other value",
  });
  return res.json({ message: "Test" });
});

app.listen(8080, () => {
  console.log("Conectado");
});
