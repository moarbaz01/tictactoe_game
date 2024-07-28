import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { useState } from "react";

const socket = io("http://localhost:5000");
function useSocket() {
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id ?? null);
    });
  }, [socket]);
  return { socket, socketId };
}

export default useSocket;
