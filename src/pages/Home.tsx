import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import useSocket from "../hooks/useSocket";

interface ConnectedUsersType {
  [key: string]: string;
}

const Home = () => {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const { socket } = useSocket();
  const [connectedUsers, setConnectedUsers] = useState<number>(0);

  // Enter in game
  const enterInGame = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!context?.name) {
        alert("Enter your name first...");
        return;
      }
      socket.emit("join", { name: context?.name });
      navigate("game");
    },
    [socket, context?.name, navigate]
  );

  const handleConnectedUsers = useCallback((data: ConnectedUsersType) => {
    setConnectedUsers(Object.entries(data).length);
    console.log("Data : ", data);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connectedUsers", handleConnectedUsers);
    return () => {
      socket.off("connectedUsers", handleConnectedUsers);
    };
  }, [socket, handleConnectedUsers]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
        width: "full",
        position: "relative",
      }}
    >
      <h1
        className="headingAnimation"
        style={{ color: "white", fontSize: "6rem", fontWeight: "bold" }}
      >
        TIC TOE GAME
      </h1>
      <p
        style={{
          position: "absolute",
          top: "50px",
          right: "50px",
          fontSize: "2rem",
          color: "white",
        }}
      >
        Active Users:{" "}
        <span style={{ color: "red", paddingLeft: "10px" }}>
          {connectedUsers}
        </span>
      </p>
      <form
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <input
          placeholder="Enter your name"
          className="nameInput"
          type="text"
          value={context?.name}
          onChange={(e) => context?.setName(e.target.value)}
        />
        <button
          className="buttonAnimation"
          onClick={enterInGame}
          style={{
            padding: "20px 60px",
            backgroundColor: "yellow",
            fontSize: "40px",
            marginTop: "20px",
            border: "5px solid red",
          }}
        >
          Play
        </button>
      </form>
    </div>
  );
};

export default Home;
