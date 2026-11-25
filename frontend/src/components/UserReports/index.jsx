"use client";
import { useMemo, useState, useEffect } from "react";
import { Eye, ClipboardList, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { fetchComAuth } from "@/utils/api";

function getStatusClass(status) {
  if (status === "Indisponível") return "unavailable";
  if (status === "Em andamento") return "review";
  if (status === "Pendente") return "pending";
  return "complete";
}

export default function UserReports() {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [data, setData] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    let ativo = true;

    async function listarRelatorios() {
      try {
        const resposta = await fetchComAuth(`/api/relatorios/meus?pagina=${pagina}&limite=10`);
        if (!resposta.ok) {
          const erro = await resposta.json().catch(() => null);
          throw new Error(erro?.erro || erro?.message || `Erro HTTP ${resposta.status}`);
        }

        const resultado = await resposta.json();
        if (!ativo) return;

        setData(resultado.dados || []);
        setTotalPaginas(resultado.paginacao?.totalPaginas || 1);
      } catch (erro) {
        if (ativo) {
          console.error("Erro ao consultar os relatórios do usuário:", erro);
        }
      }
    }

    listarRelatorios();

    return () => {
      ativo = false;
    };
  }, [pagina]);

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

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.filter((a) =>
      `${a.usuario?.nome ?? ""} ${a.id ?? ""} ${a.usuario?.cargo ?? ""} ${a.usuario?.codigo ?? ""} ${a.finalidade ?? ""} ${a.status ?? ""}`
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
                    <span>ID: {a.id}</span>
                    <span>Código: {a.usuario?.codigo}</span>
                  </div>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <span className={`report-status ${getStatusClass(a.status)}`}>
                      {a.status}
                    </span>
                    <button
                      className="seta button task-details"
                      onClick={() => setModal(a)}
                      type="button"
                      aria-label={`Abrir detalhes do relatório ${a.id}`}
                      title="Ver detalhes do relatório"
                    >
                      <Eye size={16} aria-hidden="true" />
                    </button>
                  </div>
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

      {modal && (
        <div
          className="task-modal-overlay"
          onClick={() => setModal(null)}
        >
          <div
            aria-modal="true"
            className="task-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <h2>Detalhes do Relatório</h2>

            <p>OP: {modal.tarefa?.titulo}</p>
            <p>Resultado: {modal.resultado ?? "Sem resultado"}</p>
            <p>Status: {modal.status ?? "Sem status"}</p>
            <p>Status da Tarefa: {modal.tarefa?.status ?? "Sem status"}</p>
            <p>Finalidade: {modal.finalidade ?? "Sem finalidade"}</p>
            <p>Motivo: {modal.motivo ?? "Sem motivo"}</p>
            <p>Observações: {modal.observacoes ?? "Sem observações"}</p>
            <p>Máquina: {modal.maquina?.nome}</p>
            <p>Responsável: {modal.usuario?.nome}</p>
            <p>Prazo: {converterData(modal.tarefa?.prazo)}</p>

            <button
              className="button button-outline"
              onClick={() => setModal(null)}
              type="button"
            >
              Fechar
            </button>
          </div>
        </div>
        
      )}
    </section>
  );
}
