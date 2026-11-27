"use client";

import { useMemo, useState } from "react";
import { Search, Factory, ArrowLeft, ArrowRight, Trash2, Check, X, Eye, ClipboardCheck, UserRound, CalendarClock, Clock3 } from "lucide-react";
import { fetchComAuth } from "@/utils/api";

function getStatusSlug(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("solicitada")) return "solicitada";
  if (s.includes("operação") || s.includes("operacao")) return "operacao";
  if (s.includes("manutenção") || s.includes("manutencao")) return "manutencao";
  if (s.includes("inativa")) return "inativa";
  return "disponivel";
}

const classResultado = {
  "Aprovado": "tag-aprovado",
  "Reprovado": "tag-reprovado",
  "Com Ressalvas": "tag-ressalvas",
  "Sem resultado": "tag-sem-resultado",
};

const classStatus = {
  "Em andamento": "tag-em-andamento",
  "Pendente": "tag-pendente",
  "Indisponível": "tag-indisponivel",
  "Concluído": "tag-concluido"
};

export default function MachineList({
  machines = [],
  todasMaquinas = [],
  total = machines.length,
  aumentarPagina,
  diminuirPagina,
  pagina,
  totalPaginas,
  loading = false,
  remover,
  onAtualizar,
  relatorios
}) {
  const [query, setQuery] = useState("");
  const [aba, setAba] = useState("todas"); 
  const [processandoId, setProcessandoId] = useState(null);
  const [modal, setModal] = useState(null)

  const fonteTotal = todasMaquinas.length > 0 ? todasMaquinas : machines;

  const totalSolicitadas = useMemo(() => {
    return fonteTotal.filter((m) => m.estado === "Solicitada").length;
  }, [fonteTotal]);

  const dadosFiltrados = useMemo(() => {
    let lista = aba === "solicitadas" ? fonteTotal.filter((m) => m.estado === "Solicitada") : machines;

    const q = query.trim().toLowerCase();
    if (!q) return lista;

    return lista.filter((m) =>
      `${m.nome ?? ""} ${m.estado ?? ""} ${m.operador_nome ?? ""} ${m.operador_turno ?? ""} MAQ-${m.id ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [query, machines, fonteTotal, aba]);

  async function aceitarSolicitacao(maquina) {
    try {
      setProcessandoId(maquina.id);
      const resp = await fetchComAuth(`/api/maquinas/${maquina.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: maquina.nome,
          estado: "Em Operação",
          usuario_id: maquina.usuario_id,
        }),
      });

      if (!resp.ok) {
        throw new Error("Não foi possível aceitar a solicitação.");
      }

      onAtualizar?.();
    } catch (err) {
      console.error(err);
      console.log("Erro ao aceitar solicitação: " + err.message);
    } finally {
      setProcessandoId(null);
    }
  }

  async function recusarSolicitacao(maquina) {
    try {
      setProcessandoId(maquina.id);
      const resp = await fetchComAuth(`/api/maquinas/${maquina.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: maquina.nome,
          estado: "Disponível",
          usuario_id: null,
        }),
      });

      if (!resp.ok) {
        throw new Error("Não foi possível recusar a solicitação.");
      }

      onAtualizar?.();
    } catch (err) {
      console.error(err);
      console.log("Erro ao recusar solicitação: " + err.message);
    } finally {
      setProcessandoId(null);
    }
  }

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

  function abrirDetalhes(maquina) {
    // 1. Procura na lista de relatórios qual pertence a esta máquina:
    const relatorioDaMaquina = relatorios.find(
      (r) => r.maquina?.id === maquina.id || r.maquina_id === maquina.id
    );

    // 2. Guarda no modal a MÁQUINA e quem está USANDO ela juntos:
    setModal({
      maquina: maquina,
      relatorio: relatorioDaMaquina || null
    });
  }

  return (
    <section className="panel employee-list-panel" aria-labelledby="machine-list-title">
      <div className="panel-heading employee-list-heading">
        <div>
          <h2 id="machine-list-title">Máquinas</h2>
          <p>
            {total} {total === 1 ? "máquina cadastrada" : "máquinas cadastradas"}
          </p>
        </div>

        <div className="machine-list-controls">
          <label className="employee-search">
            <Search size={15} aria-hidden="true" />
            <span className="sr-only">Buscar máquina</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar máquina ou operador"
              type="search"
              value={query}
            />
          </label>

          <div className="period-switch" style={{ display: "flex", flexDirection: "row" }}>
            <button
              type="button"
              className={aba === "todas" ? "selected" : ""}
              onClick={() => setAba("todas")}
            >
              Todas
            </button>
            <button
              type="button"
              className={aba === "solicitadas" ? "selected" : ""}
              onClick={() => setAba("solicitadas")}
            >
              Solicitações
              {totalSolicitadas > 0 && (
                <span className="tab-badge">{totalSolicitadas}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="employee-empty">Carregando equipamentos...</p>
      ) : dadosFiltrados.length > 0 ? (
        <div className="employee-list">
          {dadosFiltrados.map((m) => {
            const statusSlug = getStatusSlug(m.estado);
            const isSolicitada = m.estado === "Solicitada";
            const emProcesso = processandoId === m.id;

            return (
              <article className="employee-card" key={m.id}>
                <span className="employee-avatar" aria-hidden="true">
                  <Factory size={18} />
                </span>

                <div className="employee-details">
                  <strong>{m.nome}</strong>
                  <span>Código: MAQ-{String(m.id).padStart(3, "0")}</span>
                </div>

                <div className="employee-role">
                  <strong>
                    {m.operador_nome
                      ? `${isSolicitada ? "Solicitada por" : "Operador"}: ${m.operador_nome}`
                      : "Sem operador atribuído"}
                  </strong>
                  <span>{m.operador_turno ? `Turno: ${m.operador_turno}` : "Turno: —"}</span>
                </div>

                <div className="employee-card-actions" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className={`employee-status status-${statusSlug}`}>
                    {m.estado || "Disponível"}
                  </span>

                  {isSolicitada ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        type="button"
                        className="btn-approve"
                        title="Aceitar solicitação"
                        disabled={emProcesso}
                        onClick={() => aceitarSolicitacao(m)}
                      >
                        <Check size={14} /> Aceitar
                      </button>
                      <button
                        type="button"
                        className="btn-reject"
                        title="Recusar solicitação"
                        disabled={emProcesso}
                        onClick={() => recusarSolicitacao(m)}
                      >
                        <X size={14} /> Recusar
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        className="seta button task-details"
                        type="button"
                        title="Excluir máquina"
                        onClick={() => remover?.(m.id)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                      <button
                        className="seta button task-details"
                        type="button"
                        title="Visualizar máquina"
                        onClick={() => abrirDetalhes?.(m)}
                      >
                        <Eye size={16} aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="employee-empty">
          {aba === "solicitadas"
            ? "Nenhuma solicitação de máquina pendente no momento."
            : machines.length === 0
              ? "Nenhuma máquina cadastrada. Use o formulário para adicionar a primeira."
              : "Nenhuma máquina encontrada para essa busca."}
        </p>
      )}

      <div className="d-flex justify-content-between align-items-center w-full mt-3">
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
          className="production-modal-overlay"
          onClick={() => setModal(null)}
        >
          <div
            aria-labelledby="machine-modal-title"
            aria-modal="true"
            className="production-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className="production-modal-header">
              <div className="production-modal-heading">
                <span className="production-modal-icon" aria-hidden="true">
                  <Factory size={20} />
                </span>
                <div>
                  <span className="production-modal-eyebrow">
                    MAQ-{String(modal.maquina.id).padStart(3, "0")}
                  </span>
                  <h2 id="machine-modal-title">{modal.maquina.nome}</h2>
                </div>
              </div>
              <button
                className="production-modal-close"
                onClick={() => setModal(null)}
                type="button"
                aria-label="Fechar detalhes da máquina"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="production-modal-body">
              <div className="production-modal-status-row">
                <span className={`tag-two ${classStatus[modal.maquina.estado] ?? ""}`}>
                  {modal.maquina.estado || "Disponível"}
                </span>
                <span className="production-modal-date">
                  {modal.maquina.operador_nome
                    ? `Operador: ${modal.maquina.operador_nome}`
                    : "Sem operador atribuído"}
                </span>
              </div>

              <section className="production-modal-section">
                <h3>Informações da máquina</h3>
                <div className="production-modal-grid">
                  <div className="production-modal-field production-modal-field-wide">
                    <span>Nome</span>
                    <strong>{modal.maquina.nome}</strong>
                    <small>Código: MAQ-{String(modal.maquina.id).padStart(3, "0")}</small>
                  </div>
                  <div className="production-modal-field">
                    <span><UserRound size={14} /> Operador</span>
                    <strong>{modal.maquina.operador_nome || "Não atribuído"}</strong>
                    <small>{modal.maquina.operador_turno ? `Turno: ${modal.maquina.operador_turno}` : "Sem turno"}</small>
                  </div>
                  <div className="production-modal-field">
                    <span><Factory size={14} /> Estado</span>
                    <strong>{modal.maquina.estado || "Disponível"}</strong>
                  </div>
                </div>
              </section>

              {modal.relatorio ? (
                <section className="production-modal-section">
                  <h3>Relatório vinculado</h3>
                  <div className="production-modal-grid">
                    <div className="production-modal-field production-modal-field-wide">
                      <span>Tarefa</span>
                      <strong>{modal.relatorio.tarefa?.titulo || "Não informada"}</strong>
                      <small>{modal.relatorio.tarefa?.codigo || "Sem código"}</small>
                    </div>
                    <div className="production-modal-field">
                      <span><CalendarClock size={14} /> Prazo</span>
                      <strong>{converterData(modal.relatorio.tarefa?.prazo)}</strong>
                    </div>
                    <div className="production-modal-field">
                      <span><Clock3 size={14} /> Horário</span>
                      <strong>
                        {converterHoras(modal.relatorio.tarefa?.iniciado_em)} - {converterHoras(modal.relatorio.tarefa?.finalizado_em)}
                      </strong>
                    </div>
                  </div>
                  <dl className="production-modal-details" style={{ marginTop: "12px" }}>
                    <div>
                      <dt>Status do relatório</dt>
                      <dd>{modal.relatorio.status || "Não informado"}</dd>
                    </div>
                    <div>
                      <dt>Resultado</dt>
                      <dd>{modal.relatorio.resultado || "Não informado"}</dd>
                    </div>
                    <div>
                      <dt>Responsável</dt>
                      <dd>{modal.relatorio.usuario?.nome || "Não informado"}</dd>
                    </div>
                    <div>
                      <dt>Cargo</dt>
                      <dd>{modal.relatorio.usuario?.cargo || "Não informado"}</dd>
                    </div>
                    <div className="production-modal-detail-wide">
                      <dt>Observações</dt>
                      <dd>{modal.relatorio.observacoes || "Nenhuma observação registrada"}</dd>
                    </div>
                  </dl>
                </section>
              ) : (
                <section className="production-modal-section">
                  <dl className="production-modal-details">
                    <div className="production-modal-detail-wide">
                      <dt>Situação</dt>
                      <dd>
                        {modal.maquina.estado === "Solicitada"
                          ? `Solicitação pendente de aprovação pelo gerente. Operador: ${modal.maquina.operador_nome || "—"}`
                          : "Nenhum relatório de produção registrado para esta máquina no momento."}
                      </dd>
                    </div>
                  </dl>
                </section>
              )}
            </div>

            <footer className="production-modal-footer">
              <button
                className="button production-modal-close-button"
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
