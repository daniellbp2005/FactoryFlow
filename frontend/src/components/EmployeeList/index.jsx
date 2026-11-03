"use client";

import { useMemo, useState } from "react";
import { Search, UserRound } from "lucide-react";

export default function EmployeeList({ employees }) {
  const [query, setQuery] = useState("");

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return employees.filter((employee) =>
      `${employee.name} ${employee.email} ${employee.role} ${employee.shift}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [employees, query]);

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

      {filteredEmployees.length > 0 ? (
        <div className="employee-list">
          {filteredEmployees.map((employee) => (
            <article className="employee-card" key={employee.id}>
              <span className="employee-avatar" aria-hidden="true">
                <UserRound size={18} />
              </span>
              <div className="employee-details">
                <strong>{employee.name}</strong>
                <span>{employee.email}</span>
              </div>
              <div className="employee-role">
                <strong>{employee.role}</strong>
                <span>Turno {employee.shift}</span>
              </div>
              <span className="employee-status">Ativo</span>
            </article>
          ))}
        </div>
      ) : (
        <p className="employee-empty">
          {employees.length === 0
            ? "Nenhum funcionário cadastrado. Use o formulário para adicionar o primeiro."
            : "Nenhum funcionário encontrado para essa busca."}
        </p>
      )}
    </section>
  );
}
