import { useContext, useRef } from "react";
import { UserContext } from "../context/UserContext";
import Searching from "../component/Searching";

const Game = () => {
  const boxRef = useRef<(HTMLElement | null)[]>([]);
  const context = useContext(UserContext);

  // Handle Click to fill boxes
  const handleClick = (i: number) => {
    const box = boxRef.current[i];
    if (box && box.textContent) {
      if (box.textContent === "0") {
        box.textContent = "X";
      } else {
        box.textContent = "0";
      }
    }
  };

  if (context?.loading) {
    return <Searching />;
  }
  return (
    <div className="container">
      <div className="nameContainer">
        <h1>
          You : <span>{context?.name}</span>
        </h1>
        <h1>
          Opponent : <span>{context?.opponentName}</span>
        </h1>
      </div>
      <div className="nameContainer">
        <h1>
          Your Turn : <span>{context?.turn}</span>
        </h1>
      </div>
      <div className="game">
        {Array(9)
          .fill(0)
          .map((_, i) => {
            return (
              <div
                onClick={() => handleClick(i)}
                className="box"
                style={{ color: "yellow" }}
                key={i}
                ref={(el) => {
                  boxRef.current[i] = el;
                }}
              >
                0
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Game;
