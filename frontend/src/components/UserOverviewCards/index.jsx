'use client';

import { Activity, CalendarDays, CircleCheck, CircleX } from "lucide-react";

export default function UserOverviewCards({ data, user, usuarioLogadoId, visao = "Apenas meu" }) {
  const safeData = Array.isArray(data) ? data : [];

  // Se a visão for "Apenas meu", filtra os relatórios pelo ID do usuário logado
  const dadosFiltrados = visao === "Apenas meu" && usuarioLogadoId
    ? safeData.filter((item) => item?.usuario?.id === usuarioLogadoId || item?.usuario_id === usuarioLogadoId)
    : safeData;

  const totalAtribuidas = dadosFiltrados.length;
  const andamento = dadosFiltrados.filter((a) => a?.status === "Em andamento").length;
  const concluidos = dadosFiltrados.filter((a) => a?.status === "Concluído").length;
  const reprovados = dadosFiltrados.filter((a) => a?.status === "Indisponível" || a?.resultado === "Reprovado").length;

  return (
    <div className="overview-cards">
      <article className="metric-card">
        <span className="metric-icon">
          <Activity size={15} aria-hidden="true" />
        </span>
        <p className="metric-label">Tarefas Atribuídas</p>
        <strong className="metric-value">{totalAtribuidas}</strong>
        <span className="metric-detail teal">
          {visao === "Apenas meu" ? "Atribuídas a você" : "Total no sistema"}
        </span>
      </article>

      <article className="metric-card">
        <span className="metric-icon wait">
          <CalendarDays size={15} aria-hidden="true" />
        </span>
        <p className="metric-label">Em andamento</p>
        <strong className="metric-value">{andamento}</strong>
        <span className="metric-detail teal">
          {visao === "Apenas meu" ? "Suas em execução" : "Em execução geral"}
        </span>
      </article>

      <article className="metric-card">
        <span className="metric-icon">
          <CircleCheck size={15} aria-hidden="true" />
        </span>
        <p className="metric-label">Concluídas</p>
        <strong className="metric-value">{concluidos}</strong>
        <span className="metric-detail teal">
          {visao === "Apenas meu" ? "Finalizadas por você" : "Finalizadas geral"}
        </span>
      </article>

      <article className="metric-card">
        <span className="metric-icon denied">
          <CircleX size={15} aria-hidden="true" />
        </span>
        <p className="metric-label">Reprovadas / Paradas</p>
        <strong className="metric-value">{reprovados}</strong>
        <span className={`metric-detail ${reprovados > 0 ? "warning" : "teal"}`}>
          {reprovados > 0 ? "Requer atenção" : "Nenhuma pendência"}
        </span>
      </article>
    </div>
  );
}
