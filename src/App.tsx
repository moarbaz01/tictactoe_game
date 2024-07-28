import { Route, Routes } from "react-router-dom";
import "./App.css";
import Game from "./pages/Game";
import Home from "./pages/Home";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route />
      </Routes>
    </div>
  );
}

export default App;
