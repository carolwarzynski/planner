import { useState } from "react";
import Planner from "./components/Planner";
import Financeiro from "./components/Financeiro";
import "./App.css";

function App() {
  const [aba, setAba] = useState("planner"); // planner ou financeiro

  return (
    <div className="app-container">
      <header className="app-header">
        <button
          className={aba === "planner" ? "active" : ""}
          onClick={() => setAba("planner")}
        >
          Planner
        </button>
        <button
          className={aba === "financeiro" ? "active" : ""}
          onClick={() => setAba("financeiro")}
        >
          Financeiro
        </button>
      </header>

      <main>
        {aba === "planner" && <Planner />}
        {aba === "financeiro" && <Financeiro />}
      </main>
    </div>
  );
}

export default App;