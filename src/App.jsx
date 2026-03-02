import React, { useState } from "react";

const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
const horarios = [];
for (let h = 8; h <= 18; h++) {
  const horaFormatada = h.toString().padStart(2, "0") + ":00";
  horarios.push(horaFormatada);
}

function App() {
  const [compromissos, setCompromissos] = useState([
    { id: 1, titulo: "Estudar React" },
    { id: 2, titulo: "Treino" },
  ]);

  const [grade, setGrade] = useState({});
  const [dragging, setDragging] = useState(null);
  const [editId, setEditId] = useState(null); // Id do compromisso que está sendo editado
  const [editText, setEditText] = useState("");

  const adicionarCompromisso = () => {
    const novoId =
      compromissos.length +
      Object.values(grade).flatMap(Object.values).length +
      1;
    const novoCompromisso = { id: novoId, titulo: `Compromisso ${novoId}` };
    setCompromissos([...compromissos, novoCompromisso]);
  };

  const onDragStart = (comp) => setDragging(comp);
  const onDropGrade = (dia, hora) => {
    if (dragging) {
      setGrade({
        ...grade,
        [dia]: {
          ...grade[dia],
          [hora]: dragging,
        },
      });
      setCompromissos(compromissos.filter((c) => c.id !== dragging.id));
      setDragging(null);
    }
  };
  const onDropLista = () => {
    if (dragging) {
      setCompromissos([...compromissos, dragging]);
      const novaGrade = {};
      for (const dia in grade) {
        novaGrade[dia] = {};
        for (const hora in grade[dia]) {
          if (grade[dia][hora].id !== dragging.id) {
            novaGrade[dia][hora] = grade[dia][hora];
          }
        }
      }
      setGrade(novaGrade);
      setDragging(null);
    }
  };
  const onDragOver = (e) => e.preventDefault();

  const iniciarEdicao = (comp) => {
    setEditId(comp.id);
    setEditText(comp.titulo);
  };

  const salvarEdicao = (id, origem) => {
    if (origem === "lista") {
      setCompromissos(
        compromissos.map((c) => (c.id === id ? { ...c, titulo: editText } : c))
      );
    } else {
      const novaGrade = {};
      for (const dia in grade) {
        novaGrade[dia] = {};
        for (const hora in grade[dia]) {
          if (grade[dia][hora].id === id) {
            novaGrade[dia][hora] = { ...grade[dia][hora], titulo: editText };
          } else {
            novaGrade[dia][hora] = grade[dia][hora];
          }
        }
      }
      setGrade(novaGrade);
    }
    setEditId(null);
    setEditText("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Meu Planner Semanal</h1>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Grade Semanal */}
        <div style={{ flex: 3, border: "1px solid #ccc", padding: "10px" }}>
          <h2>Semana</h2>
          <div style={{ display: "flex" }}>
            {/* Coluna horários */}
            <div style={{ display: "flex", flexDirection: "column", marginRight: "5px" }}>
              <div style={{ height: "40px" }}></div>
              {horarios.map((hora) => (
                <div
                  key={hora}
                  style={{
                    height: "40px",
                    border: "1px solid #ddd",
                    padding: "5px",
                    textAlign: "center",
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

                {horarios.map((hora) => (
                  <div
                    key={dia + hora}
                    onDrop={() => onDropGrade(dia, hora)}
                    onDragOver={onDragOver}
                    style={{
                      height: "40px",
                      border: "1px solid #ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {grade[dia]?.[hora] && (
                      editId === grade[dia][hora].id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={() => salvarEdicao(grade[dia][hora].id, "grade")}
                          onKeyDown={(e) => e.key === "Enter" && salvarEdicao(grade[dia][hora].id, "grade")}
                          autoFocus
                        />
                      ) : (
                        <div
                          style={{
                            padding: "5px",
                            backgroundColor: "#b2ebf2",
                            borderRadius: "4px",
                            cursor: "grab",
                          }}
                          draggable
                          onDragStart={() => onDragStart(grade[dia][hora])}
                          onDoubleClick={() => iniciarEdicao(grade[dia][hora])}
                        >
                          {grade[dia][hora].titulo}
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Lista lateral */}
        <div
          style={{ flex: 1, border: "1px solid #ccc", padding: "10px" }}
          onDrop={onDropLista}
          onDragOver={onDragOver}
        >
          <h2>Compromissos</h2>
          <button onClick={adicionarCompromisso}>Adicionar Compromisso</button>
          <div style={{ marginTop: "10px" }}>
            {compromissos.map((c) =>
              editId === c.id ? (
                <input
                  key={c.id}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => salvarEdicao(c.id, "lista")}
                  onKeyDown={(e) => e.key === "Enter" && salvarEdicao(c.id, "lista")}
                  autoFocus
                />
              ) : (
                <div
                  key={c.id}
                  style={{
                    padding: "10px",
                    marginBottom: "5px",
                    backgroundColor: "#e0f7fa",
                    borderRadius: "4px",
                    cursor: "grab",
                  }}
                  draggable
                  onDragStart={() => onDragStart(c)}
                  onDoubleClick={() => iniciarEdicao(c)}
                >
                  {c.titulo}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;