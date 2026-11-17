'use client'
import { Activity, CalendarDays, CircleCheck, CircleX} from "lucide-react";

export default function UserOverviewCards() {

  return (
    <div className="overview-cards">
      <article className="metric-card">
        <span className="metric-icon">
          <Activity size={15} aria-hidden="true" />
        </span>
        <p className="metric-label">Tarefas Atribuidas</p>
        <strong className="metric-value">88</strong>
      </article>

      <article className="metric-card">
        <span className="metric-icon wait">
          <CalendarDays size={15} aria-hidden="true" />
        </span>
        <p className="metric-label">Tarefas em Andamento</p>
        <strong className="metric-value">24</strong>
      </article>

      <article className="metric-card">
        <span className="metric-icon ">
          <CircleCheck size={15} aria-hidden="true" />
        </span>
        <p className="metric-label">Tarefas Concluídas</p>
        <strong className="metric-value">42</strong>
      </article>

      <article className="metric-card">
        <span className="metric-icon denied">
          <CircleX size={15} aria-hidden="true" />
        </span>
        <p className="metric-label">Tarefas Reprovadas</p>
        <strong className="metric-value">22</strong>
      </article>
    </div>
  );
}
