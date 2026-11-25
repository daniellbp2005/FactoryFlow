"use client";
import { useMemo, useState, useEffect } from "react";
import { ClipboardList, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { fetchComAuth } from "@/utils/api";

function getStatusClass(status) {
  if (status === "Indisponível") return "unavailable";
  if (status === "Em andamento") return "review";
  if (status === "Pendente") return "pending";
  return "complete";
}

export default function UserReports({ uid }) {
  const [visao, setVisao] = useState("Todos");
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    async function listarRelatorios() {
      try {
        const linkApi = await fetchComAuth("/api/relatorios");
        const data = await linkApi.json();

        setData(data.dados || []);
        setPagina(data.paginacao.pagina || 1)
        setTotalPaginas(data.paginacao.totalPaginas || 1)
      } catch (e) {
        console.error("Erro ao consultar o backend");
      }
    }
    listarRelatorios();
  }, [])

  function aumentarPagina() {
    if (pagina < totalPaginas) {
      setPagina((prev) => prev + 1);
    }
  }

  function diminuirPagina() {
    if (pagina > 1) {
      setPagina((prev) => prev - 1);
    }
  }

  const usuarioLogadoId = uid;
  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.filter((a) => {
      const correspondeVisao =
        visao === "Todos" || a.usuario?.id === usuarioLogadoId;

      const correspondeBusca = `${a.usuario.nome} ${a.id} ${a.usuario.cargo} ${a.usuario.codigo}`
        .toLowerCase()
        .includes(normalizedQuery);

      return correspondeVisao && correspondeBusca;
    });
  }, [query, data, visao, usuarioLogadoId]);
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
        <div className="period-flex">
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
          <div className="report-switch">
            <button
              onClick={() => setVisao("Todos")}
              className={visao === "Todos" ? "selected" : ""}
              type="button"
            >
              Todos
            </button>
            <button
              onClick={() => setVisao("Apenas meu")}
              className={visao === "Apenas meu" ? "selected" : ""}
              type="button"
            >
              Apenas meu
            </button>
          </div>
        </div>
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
                    className={`report-status ${getStatusClass(a.status)}`}
                  >{a.status}
                  </span>
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
    </section>
  );
}
