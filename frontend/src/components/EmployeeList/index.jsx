"use client";
import { useMemo, useState, useEffect } from "react";
import { Search, UserRound } from "lucide-react";

export default function EmployeeList() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function listarRelatorios() {
      try {
        const linkApi = await fetch("http://localhost:8080/api/relatorios");
        const data = await linkApi.json();

        setData(data.dados || []);
      } catch (e) {
        console.error("Erro ao consultar o backend");
      }
    }
    listarRelatorios();
  }, [])

  const dadosFiltrados = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.filter((a) =>
      `${a.usuario?.codigo ?? ""} ${a.usuario?.nome ?? ""} ${a.usuario?.cargo ?? ""} ${a.usuario?.turno ?? ""}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, data]);

  function receberBoleano(data) {
    if (data === null || data === undefined) return "Não informado";

    if (data === true) {
      return "Ativo"
    } else {
      return "Indisponivel"
    }
  }

  return (
    <section className="panel employee-list-panel" aria-labelledby="employee-list-title">
      <div className="panel-heading employee-list-heading">
        <div>
          <h2 id="employee-list-title">Funcionários</h2>
          <p>{data.length} {data.length === 1 ? "pessoa cadastrada" : "pessoas cadastradas"}</p>
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
          {dadosFiltrados.map((employee) => (
            <article className="employee-card" key={employee.id}>
              <span className="employee-avatar" aria-hidden="true">
                <UserRound size={18} />
              </span>
              <div className="employee-details">
                <strong>{employee.usuario?.nome}</strong>
                <span>{employee.usuario?.codigo}</span>
              </div>
              <div className="employee-role">
                <strong>{employee.usuario?.cargo}</strong>
                <span>Turno: {employee.usuario?.turno}</span>
              </div>
              <span className="employee-status">{receberBoleano(employee.usuario?.ativo)}</span>
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