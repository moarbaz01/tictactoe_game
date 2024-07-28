import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { join } from "path";
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

interface connectedUsersType {
  [username: string]: string;
}

type playingUsersType = {
  [room: string]: {
    player1: string | null;
    player2: string | null;
  };
};

let connectedUsers: connectedUsersType = {};
let playingUsers: playingUsersType = {};

// Connection
io.on("connection", (socket) => {
  // Join tic toe game world
  socket.on("join", ({ name }) => {
    console.log("Join : ", connectedUsers)
    if (!connectedUsers[name]) {
      connectedUsers[name] = socket.id;
      console.log("Connected User Join : ", connectedUsers);
      io.emit("connectedUsers", connectedUsers);
    }
  });

  // Find user
  socket.on("find", () => {
    const emptyRoom = Object.entries(playingUsers).find(([key, value]) => {
      if (!value.player2) {
        return true
      }
    })


    console.log("Empty room : ", emptyRoom)
    if (emptyRoom) {
      playingUsers[emptyRoom[0]].player2 = socket.id;
      socket.join(emptyRoom[0]);
      io.to(emptyRoom[0]).emit("playing", { room: emptyRoom[0], ...playingUsers[emptyRoom[0]] });
      console.log("Playing users : ", playingUsers)
    } else {
      let room: string = Math.floor(Math.random() * 100).toString();
      while (playingUsers[room]) {
        room = Math.floor(Math.random() * 100).toString();
      }

      playingUsers[room] = { player1: socket.id, player2: null };
      socket.join(room);
      io.to(room).emit("playing", { room, ...playingUsers[room] });
      console.log("Playing users : ", playingUsers)
    }
  });

  // Turn
  socket.on("action", (data) => {
    const { room } = data;
    io.to(room).emit("action:receive", { ...data, id: socket.id });
  })


  // Leave the tic toe game world
  socket.on("disconnect", () => {
    Object.entries(connectedUsers).map(([key, value]) => {
      if (value === socket.id) {
        console.log("Leaved : ", connectedUsers[key]);
        delete connectedUsers[key];
        io.emit("connectedUsers", connectedUsers);
      }
    });

    Object.entries(playingUsers).map(([key, value]) => {
      if (value.player1 === socket.id || value.player2 === socket.id) {
        socket.leave(key);
        io.to(key).emit("quit:receive", {});
        delete playingUsers[key];
      }
    })
    console.log("Disconnect Playing users : ", playingUsers)
    console.log("Disconnect Connected users : ", connectedUsers)
  });

  // quit user
  socket.on("quit", () => {
    Object.entries(connectedUsers).map(([key, value]) => {
      if (value === socket.id) {
        console.log("Leaved : ", connectedUsers[key]);
        delete connectedUsers[key];
        io.emit("connectedUsers", connectedUsers);
      }
    });
    Object.entries(playingUsers).map(([key, value]) => {
      if (value.player1 === socket.id || value.player2 === socket.id) {
        socket.leave(key);
        io.to(key).emit("quit:receive", {});
        delete playingUsers[key];
      }
    })
    console.log("Playing users : ", playingUsers)
    console.log("Connected users : ", connectedUsers)
  })

  socket.emit("connectedUsers", connectedUsers);
});

app.get("/", (req, res) => {
  res.send("Hello Guyz");
});

server.listen(5000, () => {
  console.log("Server is running on 5000 port");
});
