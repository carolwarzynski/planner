import { useState, useEffect } from "react";

function Financeiro() {

  const [transacoes, setTransacoes] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");

  const [fixos, setFixos] = useState([]);
  const [novoFixo, setNovoFixo] = useState("");
  const [valorFixo, setValorFixo] = useState("");

  useEffect(() => {
    const dados = localStorage.getItem("transacoes");
    if (dados) setTransacoes(JSON.parse(dados));
  }, []);

  useEffect(() => {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  }, [transacoes]);

  const adicionarTransacao = (tipo) => {

    if (!descricao || !valor || !data) return;

    const nova = {
      id: Date.now(),
      descricao,
      valor: parseFloat(valor),
      tipo,
      data
    };

    setTransacoes([...transacoes, nova]);

    setDescricao("");
    setValor("");
    setData("");

  };

  const excluirTransacao = (id) => {
    setTransacoes(transacoes.filter(t => t.id !== id));
  };

  const adicionarFixo = () => {

    if (novoFixo === "" || valorFixo === "") return;

    const novo = {
      id: Date.now(),
      nome: novoFixo,
      valor: Number(valorFixo),
      pago: false
    };

    setFixos([...fixos, novo]);

    setNovoFixo("");
    setValorFixo("");

  };

  const togglePago = (id) => {

    const atualizados = fixos.map((f) =>
      f.id === id ? { ...f, pago: !f.pago } : f
    );

    setFixos(atualizados);

  };

  const removerFixo = (id) => {
    setFixos(fixos.filter(f => f.id !== id));
  };

  const saldo = transacoes.reduce((total, t) => {
    return t.tipo === "entrada"
      ? total + t.valor
      : total - t.valor;
  }, 0);

  const totalEntradas = transacoes
    .filter(t => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalGastos = transacoes
    .filter(t => t.tipo === "gasto")
    .reduce((acc, t) => acc + t.valor, 0);

  return (

    <div className="financeiro">

      <h1>Controle Financeiro</h1>

      <h2>Saldo: R$ {saldo.toFixed(2)}</h2>

      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <button onClick={() => adicionarTransacao("entrada")}>
        + Entrada
      </button>

      <button onClick={() => adicionarTransacao("gasto")}>
        - Gasto
      </button>

      <div className="resumo-financeiro">

        <div className="card entrada">
          <h3>Entradas</h3>
          <p>R$ {totalEntradas.toFixed(2)}</p>
        </div>

        <div className="card gasto">
          <h3>Gastos</h3>
          <p>R$ {totalGastos.toFixed(2)}</p>
        </div>

        <div className="card saldo">
          <h3>Saldo</h3>
          <p>R$ {saldo.toFixed(2)}</p>
        </div>

      </div>

      <div className="financeiro-grid">

        <div className="lista-financeira">

          <h2>Transações</h2>

          {transacoes.map((t) => (

            <div key={t.id} className={`transacao ${t.tipo}`}>

              <span>{t.descricao}</span>
              <span>{t.data}</span>
              <span>R$ {t.valor}</span>

              <button onClick={() => excluirTransacao(t.id)}>
                ✖
              </button>

            </div>

          ))}

        </div>

        <div className="despesas-fixas">

          <h2>Despesas Fixas</h2>

          <input
            placeholder="Nome da despesa"
            value={novoFixo}
            onChange={(e) => setNovoFixo(e.target.value)}
          />

          <input
            placeholder="Valor"
            type="number"
            value={valorFixo}
            onChange={(e) => setValorFixo(e.target.value)}
          />

          <button onClick={adicionarFixo}>
            Adicionar
          </button>

          {fixos.map((f) => (

            <div key={f.id} className="fixo-item">

              <input
                type="checkbox"
                checked={f.pago}
                onChange={() => togglePago(f.id)}
              />

              <span>
                {f.nome} - R$ {f.valor}
              </span>

              <button onClick={() => removerFixo(f.id)}>
                ✖
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default Financeiro;