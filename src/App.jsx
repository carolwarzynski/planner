
import React, { useState, useEffect } from "react";
import "./App.css";

const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

const horarios = [];
for (let h = 8; h <= 18; h++) {
  horarios.push(h.toString().padStart(2, "0") + ":00");
}

function App() {
  const [compromissos, setCompromissos] = useState([]);
  const [grade, setGrade] = useState({});
  const [observacoes, setObservacoes] = useState("");

  // carregar dados
  useEffect(() => {
    const compromissosSalvos = localStorage.getItem("compromissos");
    const gradeSalva = localStorage.getItem("grade");
    const observacoesSalvas = localStorage.getItem("observacoes");

    if (compromissosSalvos) setCompromissos(JSON.parse(compromissosSalvos));
    if (gradeSalva) setGrade(JSON.parse(gradeSalva));
    if (observacoesSalvas) setObservacoes(observacoesSalvas);
  }, []);

  // salvar automaticamente
  useEffect(() => {
    localStorage.setItem("compromissos", JSON.stringify(compromissos));
  }, [compromissos]);

  useEffect(() => {
    localStorage.setItem("grade", JSON.stringify(grade));
  }, [grade]);

  useEffect(() => {
    localStorage.setItem("observacoes", observacoes);
  }, [observacoes]);

  const adicionarCompromisso = () => {
    const novo = {
      id: Date.now(),
      titulo: `Compromisso ${compromissos.length + 1}`,
      concluido: false,
    };

    setCompromissos([...compromissos, novo]);
  };

  const excluirCompromisso = (id) => {
    setCompromissos(compromissos.filter((c) => c.id !== id));

    const novaGrade = { ...grade };

    Object.keys(novaGrade).forEach((key) => {
      if (novaGrade[key] === id) delete novaGrade[key];
    });

    setGrade(novaGrade);
  };

  const concluirCompromisso = (id) => {
    setCompromissos(
      compromissos.map((c) =>
        c.id === id ? { ...c, concluido: !c.concluido } : c
      )
    );
  };

  const editarCompromisso = (id, novoTitulo) => {
    setCompromissos(
      compromissos.map((c) =>
        c.id === id ? { ...c, titulo: novoTitulo } : c
      )
    );
  };

  // limpar planner
  const limparPlanner = () => {
    if (confirm("Tem certeza que deseja limpar todo o planner?")) {
      setCompromissos([]);
      setGrade({});
      setObservacoes("");

      localStorage.removeItem("compromissos");
      localStorage.removeItem("grade");
      localStorage.removeItem("observacoes");
    }
  };

  // drag
  const iniciarArrasto = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const soltar = (e, dia, hora) => {
    const id = parseInt(e.dataTransfer.getData("text/plain"));

    setGrade({
      ...grade,
      [`${dia}-${hora}`]: id,
    });

    e.preventDefault();
  };

  const permitirSoltar = (e) => e.preventDefault();

  // arrastar de volta para lista
  const soltarNaLista = (e) => {
    const id = parseInt(e.dataTransfer.getData("text/plain"));

    const novaGrade = { ...grade };

    Object.keys(novaGrade).forEach((key) => {
      if (novaGrade[key] === id) {
        delete novaGrade[key];
      }
    });

    setGrade(novaGrade);
    e.preventDefault();
  };

  return (
    <div className="planner-container">
      <h1>Meu Planner Semanal</h1>

      <button onClick={limparPlanner} className="btn-limpar">
        Limpar Planner
      </button>

      <div className="grade-container">
        <div className="horarios-coluna">
          <div className="horario-celula"></div>

          {horarios.map((hora) => (
            <div key={hora} className="horario-celula">
              {hora}
            </div>
          ))}
        </div>

        {diasDaSemana.map((dia) => (
          <div key={dia} className="dia-coluna">
            <div className="dia-cabecalho">{dia}</div>

            {horarios.map((hora) => {
              const compromissoNaCelula = compromissos.find(
                (c) => grade[`${dia}-${hora}`] === c.id
              );

              return (
                <div
                  key={hora}
                  className="celula-grade"
                  onDrop={(e) => soltar(e, dia, hora)}
                  onDragOver={permitirSoltar}
                >
                  {compromissoNaCelula && (
                    <div
                      className={`bloco-compromisso ${
                        compromissoNaCelula.concluido ? "concluido" : ""
                      }`}
                      draggable
                      onDragStart={(e) =>
                        iniciarArrasto(e, compromissoNaCelula.id)
                      }
                      onDoubleClick={() => {
                        const novoTitulo = prompt(
                          "Editar compromisso:",
                          compromissoNaCelula.titulo
                        );

                        if (novoTitulo)
                          editarCompromisso(
                            compromissoNaCelula.id,
                            novoTitulo
                          );
                      }}
                    >
                      {compromissoNaCelula.titulo}

                      <div>
                        <button
                          className="concluir"
                          onClick={() =>
                            concluirCompromisso(compromissoNaCelula.id)
                          }
                        >
                          ✔
                        </button>

                        <button
                          className="excluir"
                          onClick={() =>
                            excluirCompromisso(compromissoNaCelula.id)
                          }
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div
          className="lista-compromissos"
          onDrop={soltarNaLista}
          onDragOver={permitirSoltar}
        >
          <h2>Compromissos</h2>

          <button onClick={adicionarCompromisso}>
            Adicionar Compromisso
          </button>

          {compromissos
            .filter((c) => !Object.values(grade).includes(c.id))
            .map((c) => (
              <div
                key={c.id}
                className={`bloco-compromisso ${
                  c.concluido ? "concluido" : ""
                }`}
                draggable
                onDragStart={(e) => iniciarArrasto(e, c.id)}
                onDoubleClick={() => {
                  const novoTitulo = prompt(
                    "Editar compromisso:",
                    c.titulo
                  );

                  if (novoTitulo) editarCompromisso(c.id, novoTitulo);
                }}
              >
                {c.titulo}

                <div>
                  <button
                    className="concluir"
                    onClick={() => concluirCompromisso(c.id)}
                  >
                    ✔
                  </button>

                  <button
                    className="excluir"
                    onClick={() => excluirCompromisso(c.id)}
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="observacoes-container">
        <h2>Observações</h2>

        <textarea
          placeholder="Digite suas observações aqui..."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />
      </div>
    </div>
  );
}

export default App;