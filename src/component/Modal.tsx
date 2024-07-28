import { useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import { useCallback, useContext } from "react";
import { UserContext } from "../context/UserContext";

interface modalType {
  message: string;
}

const Modal: React.FC<modalType> = ({ message }) => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const context = useContext(UserContext);
  const handleQuitGame = useCallback(() => {
    socket.close();
    context?.setLoading(true);
    navigate("/");
  }, [context, socket, navigate]);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(5px)",
        color: "yellow",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <h1>{message}</h1>
        <button
          className="buttonAnimation"
          onClick={handleQuitGame}
          style={{
            padding: "20px 60px",
            backgroundColor: "yellow",
            fontSize: "40px",
            marginTop: "20px",
            border: "5px solid red",
          }}
        >
          Go To Home
        </button>
      </div>
    </div>
  );
};

export default Modal;
