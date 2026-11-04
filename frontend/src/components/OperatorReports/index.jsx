"use client";

import { useMemo, useState } from "react";
import { ClipboardList, Search } from "lucide-react";

const reports = [
  {
    id: "report-1",
    employeeName: "Ana Costa",
    employeeId: "1024",
    employeeCode: "FUNC-024",
    comment: "Concluiu a ordem OP-2847 dentro do prazo e seguiu os procedimentos de segurança da CNC-01.",
    createdAt: "02/11/2026 · 14:30",
    type: "Desempenho",
    status: "Concluído",
  },
  {
    id: "report-2",
    employeeName: "Bruno Lima",
    employeeId: "1031",
    employeeCode: "FUNC-031",
    comment: "Solicitou inspeção preventiva do torno CNC-02 após identificar vibração durante a operação.",
    createdAt: "02/11/2026 · 11:15",
    type: "Manutenção",
    status: "Em análise",
  },
  {
    id: "report-3",
    employeeName: "Carla Souza",
    employeeId: "1042",
    employeeCode: "FUNC-042",
    comment: "Cobriu o turno da manhã na MILL-01 e comunicou a parada do equipamento à supervisão.",
    createdAt: "01/11/2026 · 16:45",
    type: "Ocorrência",
    status: "Em análise",
  },
  {
    id: "report-4",
    employeeName: "Diego Rocha",
    employeeId: "1056",
    employeeCode: "FUNC-056",
    comment: "Finalizou o treinamento de operação segura e está liberado para atuar no turno da noite.",
    createdAt: "31/10/2026 · 09:20",
    type: "Treinamento",
    status: "Concluído",
  },
];

export default function OperatorReports() {
  const [query, setQuery] = useState("");

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return reports.filter((report) =>
      `${report.employeeName} ${report.employeeId} ${report.employeeCode} ${report.comment} ${report.type}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  return (
    <section className="panel report-list-panel" aria-labelledby="report-list-title">
      <div className="panel-heading report-list-heading">
        <div>
          <h2 id="report-list-title">Relatórios dos operadores</h2>
          <p>
            {filteredReports.length} de {reports.length}{" "}
            {reports.length === 1 ? "registro" : "registros"}
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
          {filteredReports.map((report) => (
            <article className="report-card" key={report.id}>
              <span className="report-icon" aria-hidden="true">
                <ClipboardList size={17} />
              </span>
              <div className="report-card-content">
                <div className="report-card-heading">
                  <div>
                    <strong>{report.employeeName}</strong>
                    <span className="report-type">{report.type}</span>
                  </div>
                  <time>{report.createdAt}</time>
                </div>
                <p>{report.comment}</p>
                <div className="report-card-footer">
                  <div className="report-employee-meta">
                    <span>ID: {report.employeeId}</span>
                    <span>Código: {report.employeeCode}</span>
                  </div>
                  <span
                    className={`report-status ${report.status === "Concluído" ? "complete" : "review"}`}
                  >
                    {report.status}
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
