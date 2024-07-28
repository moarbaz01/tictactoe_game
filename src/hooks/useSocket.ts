import { useEffect } from "react";
import { io } from "socket.io-client";
import { useState } from "react";

const socket = io("http://localhost:5000");
function useSocket() {
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id ?? null);
      console.log("Socket id : ", socket.id)
    });
  }, [socket]);
  return { socket, socketId };
}

export default useSocket;
