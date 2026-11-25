/* 
Padronizar o status de tarefas, e de relatórios, fazer o css do status
*/

"use client";

import { useMemo, useState, useEffect } from "react";
import { fetchComAuth } from "@/utils/api";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  ClipboardCheck,
  Clock3,
  Factory,
  UserRound,
  X,
} from "lucide-react";

export default function ProductionSchedule() {
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

      return (
        correspondeStatus &&
        correspondePrazo &&
        correspondeBusca
      );
    });
  }, [data, filtroStatus, filtroPrazo, query]);


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
        <div className="period-switch" aria-label="Período da programação">

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
              className="button button-outline task-details"
              onClick={(e) => setModal(a)}
              type="button"
            >
              Detalhes
            </button>
          </article>
        ))}
        {dadosFiltrados.length === 0 && <p className="empty-state">Nenhuma tarefa encontrada.</p>}

        <div className="d-flex justify-content-between align-items-center w-full mt-3">
          <span style={{ fontSize: "13px", color: "var(--muted)" }}>
            Página {pagina} de {Math.max(totalPaginas, 1)}
          </span>
          <div className="d-flex align-items-center gap-2">
            <div
              className="seta"
              onClick={dimimuirPagina}
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
      </div>

      {modal && (
        <div
          className="production-modal-overlay"
          onClick={() => setModal(null)}
        >
          <div
            aria-labelledby="production-modal-title"
            aria-modal="true"
            className="production-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className="production-modal-header">
              <div className="production-modal-heading">
                <span className="production-modal-icon" aria-hidden="true">
                  <ClipboardCheck size={20} />
                </span>
                <div>
                  <span className="production-modal-eyebrow">
                    {modal.codigo || "RELATÓRIO"}
                  </span>
                  <h2 id="production-modal-title">Detalhes da tarefa</h2>
                </div>
              </div>
              <button
                className="production-modal-close"
                onClick={() => setModal(null)}
                type="button"
                aria-label="Fechar detalhes da tarefa"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="production-modal-body">
              <div className="production-modal-status-row">
                <span className={`tag-two ${classStatus[modal.status] ?? ""}`}>
                  {modal.status || "Sem status"}
                </span>
                <span className={`tag ${classResultado[modal.resultado] ?? ""}`}>
                  {modal.resultado || "Sem resultado"}
                </span>
                {modal.categoria && (
                  <span className="production-modal-category">
                    {modal.categoria}
                  </span>
                )}
                <span className="production-modal-date">
                  {converterData(modal.criado_em)} às {converterHoras(modal.criado_em)}
                </span>
              </div>

              <section className="production-modal-section">
                <h3>Ordem de produção</h3>
                <div className="production-modal-grid">
                  <div className="production-modal-field production-modal-field-wide">
                    <span>OP</span>
                    <strong>{modal.tarefa?.titulo || "Não informada"}</strong>
                    <small>{modal.tarefa?.codigo || "Código não informado"}</small>
                  </div>
                  <div className="production-modal-field">
                    <span><Factory size={14} /> Máquina</span>
                    <strong>{modal.maquina?.nome || "Não informada"}</strong>
                  </div>
                  <div className="production-modal-field">
                    <span><UserRound size={14} /> Responsável</span>
                    <strong>{modal.usuario?.nome || "Não informado"}</strong>
                    <small>{modal.usuario?.cargo || "Cargo não informado"} · {modal.usuario?.codigo || "Sem código"}</small>
                  </div>
                  <div className="production-modal-field">
                    <span><CalendarClock size={14} /> Prazo</span>
                    <strong>{converterData(modal.tarefa?.prazo)}</strong>
                  </div>
                  <div className="production-modal-field">
                    <span><Clock3 size={14} /> Horário</span>
                    <strong>
                      {converterHoras(modal.tarefa?.iniciado_em)} - {converterHoras(modal.tarefa?.finalizado_em)}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="production-modal-section">
                <h3>Informações da execução</h3>
                <dl className="production-modal-details">
                  <div>
                    <dt>Status da tarefa</dt>
                    <dd>{modal.tarefa?.status || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Prioridade</dt>
                    <dd>{modal.tarefa?.prioridade || "Não informada"}</dd>
                  </div>
                  <div>
                    <dt>Setor</dt>
                    <dd>{modal.tarefa?.setor || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Finalidade</dt>
                    <dd>{modal.finalidade || "Não informada"}</dd>
                  </div>
                  <div className="production-modal-detail-wide">
                    <dt>Motivo</dt>
                    <dd>{modal.motivo || "Não informado"}</dd>
                  </div>
                  <div className="production-modal-detail-wide">
                    <dt>Observações</dt>
                    <dd>{modal.observacoes || "Nenhuma observação registrada"}</dd>
                  </div>
                </dl>
              </section>
            </div>

            <footer className="production-modal-footer">
              <button
                className="button production-modal-close-button"
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
