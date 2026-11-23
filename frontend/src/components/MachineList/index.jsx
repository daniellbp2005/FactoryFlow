"use client";

import { useMemo, useState } from "react";
import { Search, Factory, ArrowLeft, ArrowRight } from "lucide-react";

export default function MachineList({
  machines,
  aumentarPagina,
  diminuirPagina,
  cadastroTodos,
}) {
  const [query, setQuery] = useState("");

  const dadosFiltrados = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return machines.filter((a) =>
      `${a.nome ?? ""} ${a.id ?? ""} ${a.estado ?? ""}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, machines]);

  const todos = cadastroTodos.length;

  return (
    <section className="panel employee-list-panel" aria-labelledby="employee-list-title">
      <div className="panel-heading employee-list-heading">
        <div>
          <h2 id="machine-list-title">Máquinas</h2>
          <p>
            {todos} {todos === 1 ? "máquina cadastrada" : "máquinas cadastradas"}
          </p>
        </div>
        <label className="employee-search">
          <Search size={15} aria-hidden="true" />
          <span className="sr-only">Buscar máquina</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar máquina"
            type="search"
            value={query}
          />
        </label>
      </div>

      {dadosFiltrados.length > 0 ? (
        <div className="employee-list">
          {dadosFiltrados.map((machine, i) => (
            <article className="employee-card" key={i}>
              <span className="employee-avatar" aria-hidden="true">
                <Factory size={18} />
              </span>
              <div className="employee-details">
                <strong>{machine?.nome}</strong>
                <span>ID: {machine?.id ?? "Novo"}</span>
              </div>
              <div className="employee-role">
                <strong>{machine?.operador_nome ?? "Sem operador"}</strong>
                <span>Turno: {machine?.operador_turno ?? "Geral"}</span>
              </div>
              <span className="employee-status">{machine?.estado ?? "Disponível"}</span>
            </article>
          ))}
        </div>
      ) : (
        <p className="employee-empty">
          {dadosFiltrados.length === 0
            ? "Nenhuma máquina cadastrada. Use o formulário para adicionar a primeira."
            : "Nenhuma máquina encontrada para essa busca."}
        </p>
      )}
      <div className="d-flex justify-content-end w-full align-itmes-center gap-2 mt-3">
        <div className="seta" onClick={diminuirPagina}>
          <ArrowLeft size={20} />
        </div>
        <div className="seta" onClick={aumentarPagina}>
          <ArrowRight size={20} />
        </div>
      </div>
    </section>
  );
}
