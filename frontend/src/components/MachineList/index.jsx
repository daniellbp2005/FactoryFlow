"use client";

import { useMemo, useState } from "react";
import { Search, Factory, ArrowLeft, ArrowRight, Pencil, Trash2 } from "lucide-react";

function getStatusSlug(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("operação") || s.includes("operacao")) return "operacao";
  if (s.includes("manutenção") || s.includes("manutencao")) return "manutencao";
  if (s.includes("inativa")) return "inativa";
  return "disponivel";
}

export default function MachineList({
  machines = [],
  total = 0,
  onEdit,
  onDelete,
  aumentarPagina,
  diminuirPagina,
  pagina = 1,
  totalPaginas = 1,
  loading = false,
}) {
  const [query, setQuery] = useState("");

  const dadosFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return machines;
    return machines.filter((m) =>
      `${m.nome ?? ""} ${m.estado ?? ""} ${m.operador_nome ?? ""} ${m.operador_turno ?? ""} MAQ-${m.id ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [query, machines]);

  return (
    <section className="panel employee-list-panel" aria-labelledby="machine-list-title">
      <div className="panel-heading employee-list-heading">
        <div>
          <h2 id="machine-list-title">Máquinas</h2>
          <p>
            {total} {total === 1 ? "máquina cadastrada" : "máquinas cadastradas"}
          </p>
        </div>
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
      </div>

      {loading ? (
        <p className="employee-empty">Carregando equipamentos...</p>
      ) : dadosFiltrados.length > 0 ? (
        <div className="employee-list">
          {dadosFiltrados.map((m) => {
            const statusSlug = getStatusSlug(m.estado);
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
                    {m.operador_nome ? `Operador: ${m.operador_nome}` : "Sem operador atribuído"}
                  </strong>
                  <span>{m.operador_turno ? `Turno: ${m.operador_turno}` : "Turno: —"}</span>
                </div>
                <div className="employee-card-actions">
                  <span className={`employee-status status-${statusSlug}`}>
                    {m.estado || "Disponível"}
                  </span>
                  {onEdit && (
                    <button
                      type="button"
                      title="Editar máquina"
                      className="btn-card-action"
                      onClick={() => onEdit(m)}
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      title="Excluir máquina"
                      className="btn-card-action btn-card-delete"
                      onClick={() => onDelete(m.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="employee-empty">
          {machines.length === 0
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
