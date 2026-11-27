"use client";

import { useMemo, useState } from "react";
import { Search, Factory, ArrowLeft, ArrowRight, Trash2, Check, X } from "lucide-react";
import { fetchComAuth } from "@/utils/api";

function getStatusSlug(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("solicitada")) return "solicitada";
  if (s.includes("operação") || s.includes("operacao")) return "operacao";
  if (s.includes("manutenção") || s.includes("manutencao")) return "manutencao";
  if (s.includes("inativa")) return "inativa";
  return "disponivel";
}

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
}) {
  const [query, setQuery] = useState("");
  const [aba, setAba] = useState("todas"); // 'todas' | 'solicitadas'
  const [processandoId, setProcessandoId] = useState(null);

  const fonteTotal = todasMaquinas.length > 0 ? todasMaquinas : machines;

  // Conta quantas máquinas têm solicitação pendente em toda a base
  const totalSolicitadas = useMemo(() => {
    return fonteTotal.filter((m) => m.estado === "Solicitada").length;
  }, [fonteTotal]);

  const dadosFiltrados = useMemo(() => {
    // Se estiver na aba de solicitações, busca em todas as máquinas cadastradas!
    let lista = aba === "solicitadas" ? fonteTotal.filter((m) => m.estado === "Solicitada") : machines;

    const q = query.trim().toLowerCase();
    if (!q) return lista;

    return lista.filter((m) =>
      `${m.nome ?? ""} ${m.estado ?? ""} ${m.operador_nome ?? ""} ${m.operador_turno ?? ""} MAQ-${m.id ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [query, machines, fonteTotal, aba]);

  // Aceitar solicitação -> Muda estado para 'Em Operação'
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
      alert("Erro ao aceitar solicitação: " + err.message);
    } finally {
      setProcessandoId(null);
    }
  }

  // Recusar solicitação -> Volta estado para 'Disponível' e limpa usuario_id
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
      alert("Erro ao recusar solicitação: " + err.message);
    } finally {
      setProcessandoId(null);
    }
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
                    <button
                      className="seta button task-details"
                      type="button"
                      title="Excluir máquina"
                      onClick={() => remover?.(m.id)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
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
    </section>
  );
}
