import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const Searching = () => {
  const context = useContext(UserContext);

  return (
    <div
      style={{
        height: "100vh",
        width: "full",
        overflow: "hidden",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ fontSize: "4rem" }}>
        You{" "}
        <span style={{ color: "yellow", fontSize: "5rem", padding: "0 20px" }}>
          vs
        </span>{" "}
        {context?.loading ? "finding...." : context?.opponentName}
      </div>
    </div>
  );
};

export default Searching;
