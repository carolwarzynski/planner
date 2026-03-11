import { useState } from "react";
import Planner from "./components/Planner";
import Financeiro from "./components/Financeiro";
import "./App.css";

function App() {

  const [abaAtiva, setAbaAtiva] = useState("planner");

  return (

    <div className="app">

      <div className="abas">

        <button onClick={() => setAbaAtiva("planner")}>
          Planner
        </button>

        <button onClick={() => setAbaAtiva("financeiro")}>
          Financeiro
        </button>

      </div>

      {abaAtiva === "planner" && <Planner />}
      {abaAtiva === "financeiro" && <Financeiro />}

    </div>

  );

}

export default App;