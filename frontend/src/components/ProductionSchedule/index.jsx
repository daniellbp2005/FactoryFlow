"use client";

import { useMemo, useState, useEffect } from "react";

const initialTasks = [
  { time: "08:00–10:30", order: "3-2847", priority: "Alta", status: "Em andamento", machine: "CNC-01", operator: "Ana Costa" },
  { time: "09:00–12:00", order: "3-2848", priority: "Alta", status: "Em andamento", machine: "CNC-02", operator: "Bruno Lima" },
  { time: "10:00–14:00", order: "3-2851", priority: "Alta", status: "Planejada", machine: "CNC-01", operator: "Carla Souza" },
  { time: "13:00–16:00", order: "3-2855", priority: "Média", status: "Quebrada", machine: "MILL-01", operator: "Carla Souza" },
  { time: "16:00–18:00", order: "3-2858", priority: "Baixa", status: "Concluída", machine: "CNC-03", operator: "Diego Rocha" },
];

const priorityOrder = { Alta: 0, Média: 1, Baixa: 2 };

export default function ProductionSchedule() {
  const [period, setPeriod] = useState("Semana");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [sorted, setSorted] = useState(false);
  const [modal, setModal] = useState(null);
  const [data, setData] = useState([]);
  const [date, setDate] = useState();
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroPrazo, setFiltroPrazo] = useState('Todos');

  useEffect(() => {
    async function listarRelatorios() {
      try {
        const linkApi = await fetch("http://localhost:8080/api/relatorios");
        const data = await linkApi.json();

        setData(data.dados || []);
      } catch (e) {
        console.error("Erro ao consultar o backend");
      }
    }
    listarRelatorios();

  }, [])

  const dadosFiltrados = useMemo(() => {
    return data.filter((a) => {
      const correspondeStatus =
        filtroStatus === "Todos" || a.status === filtroStatus;

      const correspondePrazo = verificarPrazo(
        a.tarefa?.prazo,
        filtroPrazo,
        a.status
      );

      const correspondeBusca =
        `${a.tarefa?.titulo ?? ""} ${a.maquina?.nome ?? ""} ${a.usuario?.nome ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase());

      return (
        correspondeStatus &&
        correspondePrazo &&
        correspondeBusca
      );
    });
  }, [data, filtroStatus, filtroPrazo, query]);


  function converterHoras(data) {
    if (!data) return "--:--";
    const aux = data;
    const converter = new Date(aux.replace(" ", "T"))
    const horas = converter.getHours();
    const minutos = converter.getMinutes()
    return `${horas}:${minutos}`
  }

  function verificarPrazo(data, filtro, status) {
    if (!data) return false;

    const vencimento = new Date(
      String(data).slice(0, 10) + "T00:00:00"
    );

    if (Number.isNaN(vencimento.getTime())) return false;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const limiteSemana = new Date(hoje);
    limiteSemana.setDate(hoje.getDate() + 7);

    const limiteMes = new Date(
      hoje.getFullYear(),
      hoje.getMonth() + 1,
      0
    );

    if (filtro === "Hoje") {
      return vencimento.getTime() === hoje.getTime();
    }

    if (filtro === "Amanhã") {
      return vencimento.getTime() === amanha.getTime();
    }

    if (filtro === "Atrasadas") {
      return vencimento < hoje && status !== "Concluida";
    }

    if (filtro === "Semana") {
      return vencimento >= hoje && vencimento <= limiteSemana;
    }

    if (filtro === "Mês") {
      return vencimento >= hoje && vencimento <= limiteMes;
    }

    return true;
  }

  return (
    <section className="panel schedule-panel" aria-labelledby="schedule-title">
      <div className="panel-heading schedule-heading">
        <div>
          <h2 id="schedule-title">Programação da produção</h2>
          <p>Tarefas e ordens de serviço ilustrativas</p>
        </div>
        <div className="period-switch" aria-label="Período da programação">

          <button onClick={() => setPeriod("Dia")} className={period === "Dia" ? "selected" : ""} type="button"> Dia </button>
          <button onClick={() => setPeriod("Semana")} className={period === "Semana" ? "selected" : ""} type="button">Semana</button>
          <button onClick={() => setPeriod("Mês")} className={period === "Mês" ? "selected" : ""} type="button">Mês</button>

        </div>
      </div>

      <p className="schedule-period">Visualização: {period}</p>
      <div className="schedule-filters">
        <label>
          Buscar tarefa
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Código, máquina ou responsável"
            value={query}
          />
        </label>
        <label>
          Status
          <select
            onChange={(event) => setFiltroStatus(event.target.value)}
            value={filtroStatus}
          >
            <option value="Todos">Todos</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Pendente">Pendente</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Concluida">Concluída</option>
          </select>
        </label>
        <label>
          Prazo
          <select
            onChange={(event) => setFiltroPrazo(event.target.value)}
            value={filtroPrazo}
          >
            <option value="Todos">Todos</option>
            <option value="Hoje">Hoje</option>
            <option value="Amanhã">Amanhã</option>
            <option value="Atrasadas">Atrasadas</option>
            <option value="Semana">Esta semana</option>
            <option value="Mês">Este mês</option>
          </select>
        </label>
      </div>

      <div className="task-list">
        {dadosFiltrados.map((a) => (
          <article className="task-row" key={a.id}>
            <div className="task-time">
              <span>Horário</span>
              <strong>
                {converterHoras(a.tarefa.iniciado_em)}-
                {converterHoras(a.tarefa.finalizado_em)}
              </strong>
            </div>
            <div className="task-info">
              <div className="task-tags">
                <strong>OP {a.tarefa.titulo}</strong>
                <span className={`tag`}>{a.resultado}</span>
                <span className={`tag `}>
                  {a.status}
                </span>
              </div>
              <span>{a.maquina.nome} · {a.usuario.nome}</span>
            </div>

            <button
              id="open-details"
              className="button button-outline task-details"
              onClick={(e) => setModal(a)}
              type="button"
            >
              Detalhes
            </button>
          </article>
        ))}
        {dadosFiltrados.length === 0 && <p className="empty-state">Nenhuma tarefa encontrada.</p>}
      </div>

      {modal && (
        <div
          className="task-modal-overlay"
          onClick={() => setModal(null)}
        >
          <div
            aria-modal="true"
            className="task-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <h2>Detalhes da tarefa</h2>

            <p>OP: {modal.tarefa.titulo}</p>
            <p>Resultado: {modal.resultado}</p>
            <p>Status: {modal.status}</p>

            <p>
              Início: {converterHoras(modal.tarefa.iniciado_em)}
            </p>

            <p>
              Finalização: {converterHoras(modal.tarefa.finalizado_em)}
            </p>

            <p>Máquina: {modal.maquina.nome}</p>
            <p>Responsável: {modal.usuario.nome}</p>

            <button
              className="button button-outline"
              onClick={() => setModal(null)}
              type="button"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <button
        className="button button-primary priority-button"
        onClick={() => setSorted((current) => !current)}
        type="button"
      >
        {sorted ? "Ordem original" : "Ordenar por prioridade"}
      </button>
    </section>
  );
}
