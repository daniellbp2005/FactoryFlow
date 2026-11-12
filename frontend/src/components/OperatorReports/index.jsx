"use client";
import { useMemo, useState, useEffect } from "react";
import { ClipboardList, Search } from "lucide-react";

export default function OperatorReports() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

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

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.filter((a) =>
      `${a.usuario.nome} ${a.id} ${a.usuario.cargo} ${a.usuario.codigo}`
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
                  <span
                    className={`report-status ${a.status === "Concluído" ? "complete" : "review"}`}
                  >
                    {a.status}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="employee-empty">Nenhum relatório corresponde à busca.</p>
      )}
    </section>
  );
}
