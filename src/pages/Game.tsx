import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import Searching from "../component/Searching";
import useSocket from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import Modal from "../component/Modal";

interface dataType {
  room: string;
  player1: string;
  player2: string;
}

const Game = () => {
  const boxRef = useRef<(HTMLDivElement | null)[]>([]);
  const context = useContext(UserContext);
  const { socket } = useSocket();
  const [modal, setModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  // Conditons
  const conditions = [
    // Horizontally
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Diagonal
    [0, 4, 8],
    [2, 4, 6],
    // Vertically
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  // Check win
  const checkWin = useCallback(() => {
    const box = boxRef.current;
    for (const item of conditions) {
      const [a, b, c] = item;
      if (box[a]?.textContent && box[b]?.textContent && box[c]?.textContent) {
        if (
          box[a]?.textContent &&
          box[a].textContent === box[b]?.textContent &&
          box[b]?.textContent === box[c]?.textContent
        ) {
          box[a].style.color = "red";
          box[b].style.color = "red";
          box[c].style.color = "red";
          if (box[a].textContent === context?.yourInput) {
            setMessage("Congratulation you won...");
            setModal(true);
            break;
          } else {
            setMessage("OOPS you lose...");
            setModal(true);
            break;
          }
        }
      }
    }
  }, [context?.yourInput, conditions]);

  // Handle Click to fill boxes
  const handleClick = useCallback(
    (i: number) => {
      const box = boxRef.current[i];
      if (context?.turn === 1) {
        if (box && context?.yourInput) {
          box.textContent = context.yourInput;
          socket.emit("action", { index: i, room: context?.room });
          checkWin();
          context.setTurn(0);
        }
      } else {
        alert("Wait for your turn...");
      }
    },
    [socket, context?.room, context?.yourInput, context?.turn]
  );

  const handleInitializeBoxRef = (el: HTMLDivElement | null, i: number) => {
    boxRef.current[i] = el;
  };

  const handleQuitGame = useCallback(() => {
    context?.setOpponent("");
    context?.setLoading(true);
    socket.emit("quit", {});
    navigate("/");
  }, [socket, navigate]);

  const handleQuitReceive = useCallback(() => {
    context?.setOpponent("");
    context?.setLoading(true);
    socket.emit("find", {});
  }, [context, socket]);

  const handleReceiveAction = useCallback(
    ({ index, id }: { index: number; room: string; id: string }) => {
      if (id !== socket.id) {
        const box = boxRef.current[index];
        if (box && context?.opponentInput) {
          box.textContent = context?.opponentInput;
          checkWin();
          context?.setTurn(1);
        }
      }
    },
    [context?.opponentInput, checkWin]
  );

  useEffect(() => {
    socket.on("quit:receive", handleQuitReceive);
    socket.on("action:receive", handleReceiveAction);

    return () => {
      socket.off("quit:receive", handleQuitReceive);
      socket.off("action:receive", handleReceiveAction);
    };
  }, [socket, handleQuitReceive, handleReceiveAction]);

  useEffect(() => {
    socket.on("playing", (data: dataType) => {
      const { room, player1, player2 } = data;
      console.log("Data : ", data.room, player1, player2);
      context?.setRoom(room);
      if (player1 === socket.id && player2 !== null) {
        context?.setOpponent(player2);
        context?.setYourInput("X");
        context?.setOpponentInput("O");
        context?.setTurn(1);
      } else {
        context?.setOpponent(player1);
        context?.setYourInput("O");
        context?.setOpponentInput("X");
        context?.setTurn(0);
      }
      if (player1 && player2) {
        context?.setLoading(false);
      }
    });
  }, [socket, context]);

  if (context?.loading) {
    return <Searching />;
  }

  return (
    <>
      <div className="container">
        <div className="nameContainer">
          <h2 style={{ color: "darkorange" }}>
            You = <span style={{ color: "white" }}>{context?.name}</span>
          </h2>
          <h2 style={{ color: "darkorange" }}>
            Opponent ={" "}
            <span style={{ color: "white" }}>{context?.opponent}</span>
          </h2>
        </div>
        <div className="nameContainer">
          <h1 style={{ color: "darkorange" }}>
            <span>Your Turn</span>
            <span
              style={{ color: "black", paddingLeft: "20px", fontSize: "3rem" }}
            >
              =
            </span>
            <span style={{ color: "white", paddingLeft: "20px" }}>
              {context?.turn}
            </span>
          </h1>
        </div>
        <div style={{ position: "absolute", top: "50px", right: "50px" }}>
          <button
            onClick={handleQuitGame}
            style={{
              color: "red",
              fontSize: "1.5rem",
              fontWeight: "bold",
              padding: "10px 20px",
              background: "yellow",
            }}
          >
            Quit
          </button>
        </div>
        <div className="game">
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <div
                onClick={() => handleClick(i)}
                className="box"
                style={{ color: "yellow" }}
                key={i}
                ref={(el) => handleInitializeBoxRef(el, i)}
              ></div>
            ))}
        </div>
      </div>
      {modal && <Modal message={message} />}
    </>
  );
};

export default Game;
