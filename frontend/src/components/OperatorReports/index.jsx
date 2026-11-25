"use client";
import { useState } from "react";
import { useMemo } from "react";
import {
  ClipboardList,
  Search,
  ArrowLeft,
  ArrowRight,
  Eye,
  X,
  UserRound,
  Factory,
  CalendarClock,
  ClipboardCheck,
  Clock3,
} from "lucide-react";

function getStatusClass(status) {
  if (status === "Indisponível") return "unavailable";
  if (status === "Em andamento") return "review";
  if (status === "Pendente") return "pending";
  return "complete";
}

export default function UserReports({ query, setQuery, data, pagina, totalPaginas, diminuirPagina, aumentarPagina, removerMaquina }) {
  const [modal, setModal] = useState(null);

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.filter((a) =>
      `${a.usuario.nome} ${a.id} ${a.usuario.cargo} ${a.usuario.codigo} ${a.finalidade} ${a.status}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, data]);

  function converterHoras(data) {
    if (!data) return "-:-";
    const aux = data;
    const converter = new Date(aux.replace(" ", "T"))
    const horas = String(converter.getHours()).padStart(2, "0");
    const minutos = String(converter.getMinutes()).padStart(2, "0");
    return `${horas}:${minutos}`
  }

  function converterData(data) {
    if (!data) return "--/--/----";
    const d = new Date(data);
    if (Number.isNaN(d.getTime())) return "--/--/----";

    return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }

  return (
    <section className="panel report-list-panel" aria-labelledby="report-list-title">
      <div className="panel-heading report-list-heading">
        <div>
          <h2 id="report-list-title">Relatórios dos operadores</h2>
          <p>
            {filteredReports.length} de {data.length}{" "}
            {filteredReports.length === 1 ? "registro" : "registros"}
          </p>
        </div>
        <label className="report-search">
          <Search size={15} aria-hidden="true" />
          <span className="sr-only">Buscar relatório de operador</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar operador ou relatório"
            type="search"
            value={query}
          />
        </label>
      </div>

      {filteredReports.length ? (
        <div className="report-list">
          {filteredReports.map((a) => (
            <article className="report-card" key={a.id}>
              <span className="report-icon" aria-hidden="true">
                <ClipboardList size={17} />
              </span>
              <div className="report-card-content">
                <div className="report-card-heading">
                  <div>
                    <strong>{a.usuario?.nome}</strong>
                    <span className="report-type">{a.usuario?.cargo}</span>
                  </div>
                  <span>{converterData(a.criado_em)} - {converterHoras(a.criado_em)}</span>
                </div>
                <p>{a.finalidade}</p>
                <div className="report-card-footer">
                  <div className="report-employee-meta">
                    <span>ID: {a?.id}</span>
                    <span>Código: {a.usuario?.codigo}</span>
                  </div>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <span
                      className={`report-status ${getStatusClass(a.status)}`}
                    >{a.status}
                    </span>
                    <button
                      className="seta button task-details"
                      onClick={() => setModal(a)}
                      type="button"
                      aria-label={`Abrir detalhes do relatório ${a.id}`}
                      title="Ver detalhes do relatório"
                    >
                      <Eye size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="employee-empty">Nenhum relatório corresponde à busca.</p>
      )}

      <div className="d-flex justify-content-between align-items-center w-full mt-3 px-2">
        <span style={{ fontSize: "13px", color: "var(--muted)" }}>
          Página {pagina} de {Math.max(totalPaginas, 1)}
        </span>
        <div className="d-flex align-items-center gap-2">
          <div
            className="seta"
            onClick={diminuirPagina}
            style={{ cursor: pagina > 1 ? "pointer" : "not-allowed", opacity: pagina > 1 ? 1 : 0.4 }}
          >
            <ArrowLeft size={20} />
          </div>
          <div
            className="seta"
            onClick={aumentarPagina}
            style={{
              cursor: pagina < totalPaginas ? "pointer" : "not-allowed",
              opacity: pagina < totalPaginas ? 1 : 0.4,
            }}
          >
            <ArrowRight size={20} />
          </div>
        </div>
      </div>

      {modal && (
        <div
          className="report-modal-overlay"
          onClick={() => setModal(null)}
        >
          <div
            aria-modal="true"
            aria-labelledby="report-modal-title"
            className="report-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className="report-modal-header">
              <div className="report-modal-heading">
                <span className="report-modal-icon" aria-hidden="true">
                  <ClipboardCheck size={20} />
                </span>
                <div>
                  <span className="report-modal-eyebrow">RELATÓRIO {modal.codigo || `#${modal.id}`}</span>
                  <h2 id="report-modal-title">Detalhes da prestação de conta</h2>
                </div>
              </div>
              <button
                className="report-modal-close"
                onClick={() => setModal(null)}
                type="button"
                aria-label="Fechar detalhes do relatório"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="report-modal-body">
              <div className="report-modal-status-row">
                <span className={`report-status ${getStatusClass(modal.status)}`}>
                  {modal.status || "Sem status"}
                </span>
                <span className="report-modal-category">{modal.categoria || "Sem categoria"}</span>
                <span className="report-modal-date">
                  {converterData(modal.criado_em)} às {converterHoras(modal.criado_em)}
                </span>
              </div>

              <section className="report-modal-section">
                <h3>Tarefa executada</h3>
                <div className="report-modal-grid">
                  <div className="report-modal-field report-modal-field-wide">
                    <span>Ordem de produção</span>
                    <strong>{modal.tarefa?.titulo || "Não informada"}</strong>
                    <small>{modal.tarefa?.codigo || "Código não informado"}</small>
                  </div>
                  <div className="report-modal-field">
                    <span><Factory size={14} /> Máquina</span>
                    <strong>{modal.maquina?.nome || "Não informada"}</strong>
                  </div>
                  <div className="report-modal-field">
                    <span><UserRound size={14} /> Responsável</span>
                    <strong>{modal.usuario?.nome || "Não informado"}</strong>
                    <small>{modal.usuario?.cargo || "Cargo não informado"} · {modal.usuario?.codigo || "Sem código"}</small>
                  </div>
                  <div className="report-modal-field">
                    <span><CalendarClock size={14} /> Prazo</span>
                    <strong>{converterData(modal.tarefa?.prazo)}</strong>
                  </div>
                  <div className="report-modal-field">
                    <span><Clock3 size={14} /> Execução</span>
                    <strong>{converterHoras(modal.tarefa?.iniciado_em)} - {converterHoras(modal.tarefa?.finalizado_em)}</strong>
                  </div>
                </div>
              </section>

              <section className="report-modal-section">
                <h3>Informações do relatório</h3>
                <dl className="report-modal-details">
                  <div>
                    <dt>Finalidade</dt>
                    <dd>{modal.finalidade || "Não informada"}</dd>
                  </div>
                  <div>
                    <dt>Resultado</dt>
                    <dd>{modal.resultado || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Motivo</dt>
                    <dd>{modal.motivo || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Observações</dt>
                    <dd>{modal.observacoes || "Nenhuma observação registrada"}</dd>
                  </div>
                </dl>
              </section>
            </div>

            <footer className="report-modal-footer">
              <button
                className="button report-modal-close-button"
                onClick={() => setModal(null)}
                type="button"
              >
                Fechar
              </button>
            </footer>
          </div>
        </div>

      )}
    </section>
  );
}
