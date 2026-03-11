import { useState, useEffect } from "react";

const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

const horarios = [];
for (let h = 8; h <= 18; h++) {
  horarios.push(h.toString().padStart(2, "0") + ":00");
}

function Planner() {
  const [compromissos, setCompromissos] = useState([]);
  const [grade, setGrade] = useState({});
  const [observacoes, setObservacoes] = useState("");

  // Carregar dados do localStorage
  useEffect(() => {
    const compromissosSalvos = localStorage.getItem("compromissos");
    const gradeSalva = localStorage.getItem("grade");
    const observacoesSalvas = localStorage.getItem("observacoes");

    if (compromissosSalvos) setCompromissos(JSON.parse(compromissosSalvos));
    if (gradeSalva) setGrade(JSON.parse(gradeSalva));
    if (observacoesSalvas) setObservacoes(observacoesSalvas);
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem("compromissos", JSON.stringify(compromissos));
  }, [compromissos]);

  useEffect(() => {
    localStorage.setItem("grade", JSON.stringify(grade));
  }, [grade]);

  useEffect(() => {
    localStorage.setItem("observacoes", observacoes);
  }, [observacoes]);

  // Adicionar novo compromisso
  const adicionarCompromisso = () => {
    const novo = {
      id: Date.now(),
      titulo: `Compromisso ${compromissos.length + 1}`
    };
    setCompromissos([...compromissos, novo]);
  };

  // Drag & Drop
  const iniciarArrasto = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const permitirSoltar = (e) => e.preventDefault();

  const soltar = (e, dia, hora) => {
    const id = parseInt(e.dataTransfer.getData("text/plain"));
    setGrade({ ...grade, [`${dia}-${hora}`]: id });
    e.preventDefault();
  };

  const soltarNaLista = (e) => {
    const id = parseInt(e.dataTransfer.getData("text/plain"));
    const novaGrade = { ...grade };
    Object.keys(novaGrade).forEach((key) => {
      if (novaGrade[key] === id) delete novaGrade[key];
    });
    setGrade(novaGrade);
  };

  // Editar título do compromisso
  const editarCompromisso = (id, tituloAtual) => {
    const novoTitulo = prompt("Edite o título do compromisso:", tituloAtual);
    if (novoTitulo !== null && novoTitulo.trim() !== "") {
      setCompromissos(
        compromissos.map((c) =>
          c.id === id ? { ...c, titulo: novoTitulo } : c
        )
      );
    }
  };

  return (
    <div className="planner-container">
      <h1>Meu Planner Semanal</h1>

      <div className="grade-container">
        <div className="horarios-coluna">
          <div className="horario-celula"></div>
          {horarios.map((hora) => (
            <div key={hora} className="horario-celula">{hora}</div>
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
                      className="bloco-compromisso"
                      draggable
                      onDragStart={(e) =>
                        iniciarArrasto(e, compromissoNaCelula.id)
                      }
                      onDoubleClick={() =>
                        editarCompromisso(
                          compromissoNaCelula.id,
                          compromissoNaCelula.titulo
                        )
                      }
                    >
                      {compromissoNaCelula.titulo}
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

          <button onClick={adicionarCompromisso}>Adicionar</button>

          {compromissos
            .filter((c) => !Object.values(grade).includes(c.id))
            .map((c) => (
              <div
                key={c.id}
                draggable
                className="bloco-compromisso"
                onDragStart={(e) => iniciarArrasto(e, c.id)}
                onDoubleClick={() => editarCompromisso(c.id, c.titulo)}
              >
                {c.titulo}
              </div>
            ))}
        </div>
      </div>

      <div className="observacoes-container">
        <h2>Observações</h2>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Planner;