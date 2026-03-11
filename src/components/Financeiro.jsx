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
    const fixosSalvos = localStorage.getItem("fixos");
    if (dados) setTransacoes(JSON.parse(dados));
    if (fixosSalvos) setFixos(JSON.parse(fixosSalvos));
  }, []);

  useEffect(() => {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  }, [transacoes]);

  useEffect(() => {
    localStorage.setItem("fixos", JSON.stringify(fixos));
  }, [fixos]);

  const adicionarTransacao = (tipo) => {
    if (!descricao || !valor || !data) return;
    const nova = { id: Date.now(), descricao, valor: parseFloat(valor), tipo, data };
    setTransacoes([...transacoes, nova]);
    setDescricao(""); setValor(""); setData("");
  };

  const excluirTransacao = (id) => setTransacoes(transacoes.filter((t) => t.id !== id));
  const adicionarFixo = () => {
    if (!novoFixo || !valorFixo) return;
    const novo = { id: Date.now(), nome: novoFixo, valor: Number(valorFixo), pago: false };
    setFixos([...fixos, novo]);
    setNovoFixo(""); setValorFixo("");
  };
  const togglePago = (id) => setFixos(fixos.map((f) => f.id === id ? { ...f, pago: !f.pago } : f));
  const removerFixo = (id) => setFixos(fixos.filter((f) => f.id !== id));

  const saldo = transacoes.reduce((total, t) => t.tipo === "entrada" ? total + t.valor : total - t.valor, 0);
  const totalEntradas = transacoes.filter(t => t.tipo==="entrada").reduce((acc,t)=>acc+t.valor,0);
  const totalGastos = transacoes.filter(t => t.tipo==="gasto").reduce((acc,t)=>acc+t.valor,0);

  return (
    <div className="financeiro-container">
      <h1>Controle Financeiro</h1>
      <h2>Saldo: R$ {saldo.toFixed(2)}</h2>

      <div className="colunas-container">
        <div className="coluna-registros">
          <div className="registros-card">
            <h3>Registros</h3>
            <input placeholder="Descrição" value={descricao} onChange={e=>setDescricao(e.target.value)} />
            <input placeholder="Valor" type="number" value={valor} onChange={e=>setValor(e.target.value)} />
            <input type="date" value={data} onChange={e=>setData(e.target.value)} />
            <div className="botoes-registros">
              <button onClick={()=>adicionarTransacao("entrada")}>+ Entrada</button>
              <button onClick={()=>adicionarTransacao("gasto")}>- Gasto</button>
            </div>

            <div className="resumo-financeiro">
              <div className="card entrada"><h4>Entradas</h4><p>R$ {totalEntradas.toFixed(2)}</p></div>
              <div className="card gasto"><h4>Gastos</h4><p>R$ {totalGastos.toFixed(2)}</p></div>
            </div>

            <div className="lista-financeira">
              {transacoes.map(t=>(
                <div key={t.id} className={`transacao ${t.tipo}`}>
                  <span>{t.descricao}</span>
                  <span>{t.data}</span>
                  <span>R$ {t.valor}</span>
                  <button onClick={()=>excluirTransacao(t.id)}>✖</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="coluna-fixos">
          <div className="despesas-fixas-card">
            <h3>Despesas Fixas</h3>
            <input placeholder="Nome da despesa" value={novoFixo} onChange={e=>setNovoFixo(e.target.value)} />
            <input placeholder="Valor" type="number" value={valorFixo} onChange={e=>setValorFixo(e.target.value)} />
            <button onClick={adicionarFixo}>Adicionar</button>
            {fixos.map(f=>(
              <div key={f.id} className="fixo-item">
                <input type="checkbox" checked={f.pago} onChange={()=>togglePago(f.id)} />
                <span>{f.nome} - R$ {f.valor}</span>
                <button onClick={()=>removerFixo(f.id)}>✖</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Financeiro;