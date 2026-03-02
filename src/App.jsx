const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

// Gerando horários de 1 em 1 hora
const horarios = [];
for (let h = 8; h <= 18; h++) {
  const horaFormatada = h.toString().padStart(2, "0") + ":00";
  horarios.push(horaFormatada);
}

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Meu Planner Semanal</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        
        {/* Grade Semanal */}
        <div style={{ flex: 3, border: "1px solid #ccc", padding: "10px" }}>
          <h2>Semana</h2>
          <div style={{ display: "flex" }}>
            {/* Coluna de horários */}
            <div style={{ display: "flex", flexDirection: "column", marginRight: "5px" }}>
              <div style={{ height: "40px" }}></div> {/* Espaço para o cabeçalho da semana */}
              {horarios.map((hora) => (
                <div
                  key={hora}
                  style={{
                    height: "40px",
                    border: "1px solid #ddd",
                    padding: "5px",
                    textAlign: "center"
                  }}
                >
                  {hora}
                </div>
              ))}
            </div>

            {/* Colunas dos dias */}
            {diasDaSemana.map((dia) => (
              <div key={dia} style={{ flex: 1 }}>
                <div
                  style={{
                    height: "40px",
                    border: "1px solid #ddd",
                    textAlign: "center",
                    padding: "10px",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {dia}
                </div>
                {horarios.map((hora, index) => (
                  <div
                    key={index}
                    style={{
                      height: "40px",
                      border: "1px solid #ddd",
                    }}
                  >
                    {/* Aqui você pode adicionar tarefas ou compromissos */}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div style={{ flex: 1, border: "1px solid #ccc", padding: "10px" }}>
          <h2>Compromissos</h2>
          <p>Aqui vai a lista de tarefas</p>
        </div>

      </div>
    </div>
  );
}

export default App;