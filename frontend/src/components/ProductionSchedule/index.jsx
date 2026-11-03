"use client";

import { useMemo, useState } from "react";

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

  const tasks = useMemo(() => {
    const filtered = initialTasks.filter((task) => {
      const matchesQuery = `${task.order} ${task.machine} ${task.operator}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesQuery && (status === "Todos" || task.status === status);
    });

    return sorted
      ? [...filtered].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      : filtered;
  }, [query, sorted, status]);

  return (
    <section className="panel schedule-panel" aria-labelledby="schedule-title">
      <div className="panel-heading schedule-heading">
        <div>
          <h2 id="schedule-title">Programação da produção</h2>
          <p>Tarefas e ordens de serviço ilustrativas</p>
        </div>
        <div className="period-switch" aria-label="Período da programação">
          {["Dia", "Semana", "Mês"].map((item) => (
            <button
              aria-pressed={period === item}
              className={period === item ? "selected" : ""}
              key={item}
              onClick={() => setPeriod(item)}
              type="button"
            >
              {item}
            </button>
          ))}
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
          <select onChange={(event) => setStatus(event.target.value)} value={status}>
            <option>Todos</option>
            <option>Em andamento</option>
            <option>Planejada</option>
            <option>Quebrada</option>
            <option>Concluída</option>
          </select>
        </label>
        <label>
          Prazo
          <select defaultValue="Todos">
            <option>Todos</option>
            <option>Hoje</option>
            <option>Esta semana</option>
          </select>
        </label>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <article className="task-row" key={task.order}>
            <div className="task-time">
              <span>Horário</span>
              <strong>{task.time}</strong>
            </div>
            <div className="task-info">
              <div className="task-tags">
                <strong>OP {task.order}</strong>
                <span className={`tag priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                <span className={`tag status-${task.status.toLowerCase().replace(" ", "-")}`}>
                  {task.status}
                </span>
              </div>
              <span>{task.machine} · {task.operator}</span>
            </div>
            <button className="button button-outline task-details" type="button">
              Detalhes
            </button>
          </article>
        ))}
        {tasks.length === 0 && <p className="empty-state">Nenhuma tarefa encontrada.</p>}
      </div>

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
