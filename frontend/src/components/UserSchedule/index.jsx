"use client";

import { useMemo, useState, useEffect } from "react";
import { fetchComAuth } from "@/utils/api";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  ClipboardCheck,
  X,
  UserRound,
  Factory,
  CalendarClock,
  Clock3,
} from "lucide-react";

function getStatusClass(status) {
  if (status === "Indisponível") return "unavailable";
  if (status === "Em andamento") return "review";
  if (status === "Pendente") return "pending";
  return "complete";
}

export default function UserSchedule({ uid }) {
  const [visao, setVisao] = useState("Todos");
  const [period, setPeriod] = useState("Semana");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [data, setData] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroPrazo, setFiltroPrazo] = useState('Todos');
  let [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);


  const classResultado = {
    "Aprovado": "tag-aprovado",
    "Reprovado": "tag-reprovado",
    "Com Ressalvas": "tag-ressalvas",
    "Sem resultado": "tag-sem-resultado",
  };

  const classStatus = {
    "Em andamento": "tag-em-andamento",
    "Pendente": "tag-pendente",
    "Indisponível": "tag-indisponivel",
    "Concluído": "tag-concluido"
  };

  useEffect(() => {
    async function listarRelatorios() {
      try {
        const linkApi = await fetchComAuth(`/api/relatorios?pagina=${pagina}&limite=10`);
        const data = await linkApi.json();

        setData(data.dados || []);
        if (data.paginacao?.totalPaginas) {
          setTotalPaginas(data.paginacao.totalPaginas);
        }
      } catch (e) {
        console.error("Erro ao consultar o backend");
      }
    }
    listarRelatorios();

  }, [pagina])

  function aumentarPagina() {
    if (pagina < totalPaginas) {
      setPagina((prev) => prev + 1);
    }
  }

  function dimimuirPagina() {
    if (pagina > 1) {
      setPagina((prev) => prev - 1);
    }
  }
  const usuarioLogadoId = uid;
  const dadosFiltrados = useMemo(() => {

    return data.filter((a) => {
      const correspondeStatus =
        filtroStatus === "Todos" || a.status === filtroStatus;

      const correspondePrazo = verificarPrazo(
        a.tarefa?.prazo,
        filtroPrazo,
        a.status
      );

      const correspondeBusca =
        `${a.codigo ?? ""} ${a.maquina?.nome ?? ""} ${a.usuario?.nome ?? ""} ${a.tarefa?.codigo ?? ""} ${a.tarefa?.titulo ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase());

          const correspondeVisao =
          visao === "Todos" || a.usuario?.id === usuarioLogadoId;
    
        return (
          correspondeStatus &&
          correspondePrazo &&
          correspondeBusca &&
          correspondeVisao
        );
      });
    }, [data, filtroStatus, filtroPrazo, query, visao]);

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

  function verificarPrazo(data, filtro, status) {
    if (!data) return false;

    const vencimento = new Date(
      String(data).slice(0, 10) + "T00:00:00"
    );

    if (Number.isNaN(vencimento.getTime())) return false;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const limiteSemana = new Date(hoje);
    limiteSemana.setDate(hoje.getDate() + 7);

    const limiteMes = new Date(
      hoje.getFullYear(),
      hoje.getMonth() + 1,
      0
    );

    if (filtro === "Hoje") {
      return vencimento.getTime() === hoje.getTime();
    }

    if (filtro === "Amanhã") {
      return vencimento.getTime() === amanha.getTime();
    }

    if (filtro === "Atrasadas") {
      return vencimento < hoje && status !== "Concluida";
    }

    if (filtro === "Semana") {
      return vencimento >= hoje && vencimento <= limiteSemana;
    }

    if (filtro === "Mês") {
      return vencimento >= hoje && vencimento <= limiteMes;
    }

    return true;
  }

  return (
    <section className="panel schedule-panel" aria-labelledby="schedule-title">
      <div className="panel-heading schedule-heading">
        <div>
          <h2 id="schedule-title">Programação da produção</h2>
          <p>Tarefas e ordens de serviço ilustrativas</p>
        </div>
        <div className="period-flex">
          <div className="period-switch" aria-label="Período da programação">
            <button
              onClick={() => setVisao("Apenas meu")}
              className={visao === "Apenas meu" ? "selected" : ""}
              type="button"
            >
              Apenas meu
            </button>
            <button
              onClick={() => setVisao("Todos")}
              className={visao === "Todos" ? "selected" : ""}
              type="button"
            >
              Todos
            </button>
          </div>
          <div className="period-switch">
          <button
              onClick={() => {
                setPeriod("Dia")
                setFiltroPrazo("Dia")
              }}
              className={period === "Dia" ? "selected" : ""}
              type="button"
            >
              Dia
            </button>
            <button
              onClick={() => {
                setPeriod("Semana")
                setFiltroPrazo("Semana")
              }}
              className={period === "Semana" ? "selected" : ""}
              type="button"
            >
              Semana
            </button>
            <button
              onClick={() => {
                setPeriod("Mês")
                setFiltroPrazo("Mês")
              }}
              className={period === "Mês" ? "selected" : ""}
              type="button"
            >
              Mês
            </button>
          </div>
        </div>
      </div>

      <p className="schedule-period">Visualização: {period}</p>
      <div className="schedule-filters">
        <label>
          Buscar tarefa
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Código, máquina ou responsável"
            value={query}
          />
        </label>
        <label>
          Status
          <select
            onChange={(event) => setFiltroStatus(event.target.value)}
            value={filtroStatus}
          >
            <option value="Todos">Todos</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Pendente">Pendente</option>
            <option value="Indisponível">Reporvados</option>
            <option value="Concluído">Concluída</option>
          </select>
        </label>
        <label>
          Prazo
          <select
            onChange={(event) => setFiltroPrazo(event.target.value)}
            value={filtroPrazo}
          >
            <option value="Todos">Todos</option>
            <option value="Hoje">Hoje</option>
            <option value="Amanhã">Amanhã</option>
            <option value="Atrasadas">Atrasadas</option>
            <option value="Semana">Esta semana</option>
            <option value="Mês">Este mês</option>
          </select>
        </label>
      </div>

      <div className="task-list">
        {dadosFiltrados.map((a) => (
          <article className="task-row" key={a.id}>
            <div className="task-time">
              <span>Horário</span>
              <strong>
                {converterHoras(a.tarefa?.iniciado_em)}-
                {converterHoras(a.tarefa?.finalizado_em)}
              </strong>
            </div>
            <div className="task-info">
              <div className="task-tags">
                <strong>OP {a.tarefa?.titulo}</strong>

                <span className={`tag ${classResultado[a.resultado] ?? ""}`}>
                  {a.resultado ?? "Sem resultado"}
                </span>

                <span className={`tag-two ${classStatus[a.status] ?? ""}`}>
                  {a.status ?? "Sem status"}
                </span>

              </div>
              <span>{a.maquina?.nome} · {a.usuario?.nome}</span>
            </div>

            <button
              id="open-details"
              className="button seta task-details"
              onClick={(e) => setModal(a)}
              type="button"
            >
              <Eye size={16} aria-hidden="true" />
            </button>
          </article>
        ))}
        {dadosFiltrados.length === 0 && <p className="empty-state">Nenhuma tarefa encontrada.</p>}

        <div className="d-flex justify-content-end w-full align-itmes-center gap-2">
          <div className="seta" onClick={dimimuirPagina}>
            <ArrowLeft size={20} />
          </div>
          <div className="seta" onClick={aumentarPagina}>
            <ArrowRight size={20} />
          </div>
        </div>
      </div>

      {modal && (
        <div
          className="report-modal-overlay"
          onClick={() => setModal(null)}
        >
          <div
            aria-modal="true"
            aria-labelledby="schedule-report-modal-title"
            className="report-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className="report-modal-header">
              <div className="report-modal-heading">
                <span className="report-modal-icon" aria-hidden="true">
                  <ClipboardCheck size={20} />
                </span>
                <div>
                  <span className="report-modal-eyebrow">
                    RELATÓRIO {modal.codigo || `#${modal.id}`}
                  </span>
                  <h2 id="schedule-report-modal-title">Detalhes do relatório</h2>
                </div>
              </div>
              <button
                className="report-modal-close"
                onClick={() => setModal(null)}
                type="button"
                aria-label="Fechar detalhes do relatório"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="report-modal-body">
              <div className="report-modal-status-row">
                <span className={`report-status ${getStatusClass(modal.status)}`}>
                  {modal.status || "Sem status"}
                </span>
                <span className="report-modal-category">
                  {modal.categoria || "Sem categoria"}
                </span>
                <span className="report-modal-date">
                  {converterData(modal.criado_em)} às {converterHoras(modal.criado_em)}
                </span>
              </div>

              <section className="report-modal-section">
                <h3>Tarefa executada</h3>
                <div className="report-modal-grid">
                  <div className="report-modal-field report-modal-field-wide">
                    <span>Ordem de produção</span>
                    <strong>{modal.tarefa?.titulo || "Não informada"}</strong>
                    <small>{modal.tarefa?.codigo || "Código não informado"}</small>
                  </div>
                  <div className="report-modal-field">
                    <span><Factory size={14} /> Máquina</span>
                    <strong>{modal.maquina?.nome || "Não informada"}</strong>
                  </div>
                  <div className="report-modal-field">
                    <span><UserRound size={14} /> Responsável</span>
                    <strong>{modal.usuario?.nome || "Não informado"}</strong>
                    <small>
                      {modal.usuario?.cargo || "Cargo não informado"} · {modal.usuario?.codigo || "Sem código"}
                    </small>
                  </div>
                  <div className="report-modal-field">
                    <span><CalendarClock size={14} /> Prazo</span>
                    <strong>{converterData(modal.tarefa?.prazo)}</strong>
                  </div>
                  <div className="report-modal-field">
                    <span><Clock3 size={14} /> Execução</span>
                    <strong>
                      {converterHoras(modal.tarefa?.iniciado_em)} - {converterHoras(modal.tarefa?.finalizado_em)}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="report-modal-section">
                <h3>Informações do relatório</h3>
                <dl className="report-modal-details">
                  <div>
                    <dt>Resultado</dt>
                    <dd>{modal.resultado || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Status da tarefa</dt>
                    <dd>{modal.tarefa?.status || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Finalidade</dt>
                    <dd>{modal.finalidade || "Não informada"}</dd>
                  </div>
                  <div>
                    <dt>Motivo</dt>
                    <dd>{modal.motivo || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Observações</dt>
                    <dd>{modal.observacoes || "Nenhuma observação registrada"}</dd>
                  </div>
                </dl>
              </section>
            </div>

            <footer className="report-modal-footer">
              <button
                className="button report-modal-close-button"
                onClick={() => setModal(null)}
                type="button"
              >
                Fechar
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
    
  );
}
