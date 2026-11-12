"use client";
import { useMemo, useState } from "react";
import { Search, UserRound } from "lucide-react";

export default function EmployeeList({employees}) {
  const [query, setQuery] = useState("");

  const dadosFiltrados = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return employees.filter((a) =>
      `${a.codigo ?? ""} ${a.nome ?? ""} ${a.cargo ?? ""} ${a.turno ?? ""} ${a.ativo ?? ""}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, employees]);

  function receberBoleano(data) {
    if (data === null || data === undefined) return "Não informado";

    if (data === 1) {
      return "Ativo"
    } else {
      return "Desativado"
    }
  }

  return (
    <section className="panel employee-list-panel" aria-labelledby="employee-list-title">
      <div className="panel-heading employee-list-heading">
        <div>
          <h2 id="employee-list-title">Funcionários</h2>
          <p>{employees.length} {employees.length === 1 ? "pessoa cadastrada" : "pessoas cadastradas"}</p>
        </div>
        <label className="employee-search">
          <Search size={15} aria-hidden="true" />
          <span className="sr-only">Buscar funcionário</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar funcionário"
            type="search"
            value={query}
          />
        </label>
      </div>

      {dadosFiltrados.length > 0 ? (  
        <div className="employee-list">
          {dadosFiltrados.map((employee, i) => (
            <article className="employee-card" key={i}>
              <span className="employee-avatar" aria-hidden="true">
                <UserRound size={18} />
              </span>
              <div className="employee-details">
                <strong>{employee?.nome}</strong>
                <span>{employee?.codigo}</span>
              </div>
              <div className="employee-role">
                <strong>{employee?.cargo}</strong>
                <span>Turno: {employee?.turno}</span>
              </div>
              <span className="employee-status">{receberBoleano(employee?.ativo)}</span>
            </article>
          ))}
        </div>
      ) : (
        <p className="employee-empty">
          {dadosFiltrados.length === 0
            ? "Nenhum funcionário cadastrado. Use o formulário para adicionar o primeiro."
            : "Nenhum funcionário encontrado para essa busca."}
        </p>
      )}
    </section>
  );
}