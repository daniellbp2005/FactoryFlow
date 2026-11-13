'use client'
import { Activity, CalendarDays, CircleAlert, UsersRound } from "lucide-react";

export default function OverviewCards({ data, user }) {
  
  const safeData = Array.isArray(data) ? data : [];
  const safeUser = Array.isArray(user) ? user : [];
  
    const andamento = safeData.filter((a) => a?.status === "Em andamento").length;
    const concluidos = safeData.filter((a) => a?.status === "Concluído").length;
    const ativos = safeUser.filter((a) => a?.ativo === 1).length;
    const reprovados = safeData.filter((a) => a?.status === "Indisponível").length;

  return (
    <div className="overview-cards">
      <article className="metric-card">
        <span className="metric-icon">
          <CalendarDays size={15} aria-hidden="true" />
        </span>
        <p className="metric-label">Em andamento</p>
        <strong className="metric-value">{andamento}</strong>
        <span className="metric-detail teal">Nesta demonstração</span>
      </article>

      <article className="metric-card">
        <span className="metric-icon">
          <Activity size={15} aria-hidden="true" />
        </span>
        <p className="metric-label">Concluídas</p>
        <strong className="metric-value">{concluidos}</strong>
        <span className="metric-detail teal">Capacidade estimada</span>
      </article>

      <article className="metric-card">
        <span className="metric-icon">
          <UsersRound size={15} aria-hidden="true" />
        </span>
        <p className="metric-label">Usuarios Ativos</p>
        <strong className="metric-value">{ativos}</strong>
        <span className="metric-detail teal">Equipe de exemplo</span>
      </article>

      <article className="metric-card">
        <span className="metric-icon">
          <CircleAlert size={15} aria-hidden="true" />
        </span>
        <p className="metric-label">Reprovados</p>
        <strong className="metric-value">{reprovados}</strong>
        <span className="metric-detail warning">Requer atenção</span>
      </article>
    </div>
  );
}
