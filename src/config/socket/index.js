import io from "socket.io";

let socket = null;

export function connect(server) {
  const socketIO = io(server);
  socketIO.on("connection", function (socket) {
    console.log("Usuário " + socket.id + " conectado.");
    socket.on("disconnect", (reason) => {
      console.log("Usuário " + socket.id + " desconectado.");
    });
  });
  socket = socketIO;
}

export function getSocket() {
  return socket;
}
