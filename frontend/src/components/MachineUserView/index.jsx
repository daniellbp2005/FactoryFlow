"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Factory, X, ArrowLeft, ArrowRight } from "lucide-react";
import { fetchComAuth } from "../../utils/api";

const SOLICITACAO_INICIAL = {
    descricao: "",
    quantidade: "1",
    inicioUso: "",
    fimUso: "",
};

function getStatusClass(status) {
    if (status === "Solicitada") return "requested";
    if (status === "Em Operação") return "running";
    if (status === "Em Manutenção") return "maintenance";
    if (status === "Inativa") return "inactive";
    return "available";
}

export default function MachineUserView() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState("Todos");
    const [modal, setModal] = useState(null);
    const [solicitacao, setSolicitacao] = useState(SOLICITACAO_INICIAL);
    const [erroSolicitacao, setErroSolicitacao] = useState("");
    const [enviandoSolicitacao, setEnviandoSolicitacao] = useState(false);
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // Carregar usuário logado
    useEffect(() => {
        try {
            const u = JSON.parse(localStorage.getItem("factoryflow_usuario"));
            setUsuarioLogado(u);
        } catch (e) {
            console.error("Erro ao ler usuário do localStorage", e);
        }
    }, []);

    // Carregar máquinas da página atual
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const resp = await fetchComAuth(`/api/maquinas?pagina=${pagina}&limite=10`);
                if (!resp.ok) throw new Error(`Erro ao buscar máquinas (${resp.status})`);
                const data = await resp.json();
                setMachines(data.dados || []);
                if (data.paginacao?.totalPaginas) {
                    setTotalPaginas(data.paginacao.totalPaginas);
                }
                setError(null);
            } catch (e) {
                setError(e.message);
                setMachines([]);
            } finally {
                setLoading(false);
            }
        };
        load();
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

    const solicitar = async (machine) => {
        try {
            const userLocal = usuarioLogado || (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("factoryflow_usuario") || "null") : null);

            const resp = await fetchComAuth(`/api/maquinas/${machine.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: machine.nome,
                    estado: "Solicitada",
                    usuario_id: userLocal?.id || null
                })
            });

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                throw new Error(err.erro || `Falha ao solicitar máquina (${resp.status})`);
            }
            // Atualiza a máquina localmente com o novo status
            setMachines((prev) => prev.map((m) => m.id === machine.id ? { ...m, estado: "Solicitada", usuario_id: userLocal?.id, operador_nome: userLocal?.nome } : m));
            setModal(null);
            setSolicitacao(SOLICITACAO_INICIAL);
            alert("Solicitação enviada com sucesso! Aguarde a aprovação do gerente.");
            return true;
        } catch (e) {
            setErroSolicitacao(e.message);
            return false;
        }
    };

    const enviarSolicitacao = async (event) => {
        event.preventDefault();
        setErroSolicitacao("");

        if (new Date(solicitacao.fimUso) <= new Date(solicitacao.inicioUso)) {
            setErroSolicitacao("O final do uso deve ser posterior ao início.");
            return;
        }

        setEnviandoSolicitacao(true);
        await solicitar(modal);
        setEnviandoSolicitacao(false);
    };

    const abrirModal = (machine) => {
        setSolicitacao(SOLICITACAO_INICIAL);
        setErroSolicitacao("");
        setModal(machine);
    };

    const fecharModal = () => {
        if (enviandoSolicitacao) return;
        setModal(null);
        setErroSolicitacao("");
    };

    const visibleMachines = useMemo(() => {
        if (view === "Apenas Disponíveis") {
            return machines.filter((machine) => machine.estado === "Disponível");
        }
        return machines;
    }, [machines, view]);

    return (
        <section className="panel machine-fleet" aria-labelledby="machine-fleet-title">
            <div className="panel-heading machine-fleet-toolbar">
                <div>
                    <h2 id="machine-fleet-title">Máquinas cadastradas</h2>
                    <p>Acompanhe a disponibilidade dos equipamentos.</p>
                </div>
                <div className="period-flex">
                    <div className="machines-switch" aria-label="Filtro de disponibilidade">
                        <button
                            className={view === "Todos" ? "selected" : ""}
                            onClick={() => setView("Todos")}
                            type="button"
                        >
                            Todos
                        </button>
                        <button
                            className={view === "Apenas Disponíveis" ? "selected" : ""}
                            onClick={() => setView("Apenas Disponíveis")}
                            type="button"
                        >
                            Apenas Disponíveis
                        </button>
                    </div>
                </div>
            </div>

            {loading && <p className="employee-empty">Carregando máquinas...</p>}
            {error && <p className="employee-empty">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="report-list">
                        {visibleMachines.map((machine) => (
                            <article className="report-card" key={machine.id}>
                                <span className="report-icon" aria-hidden="true">
                                    <Factory size={17} aria-hidden="true" />
                                </span>
                                <div className="report-card-content">
                                    <div className="report-card-heading">
                                        <div>
                                            <strong>{machine.nome}</strong>
                                            <span className={`machine-situation ${getStatusClass(machine.estado)}`}>{machine.estado}</span>
                                        </div>
                                    </div>
                                    <div className="report-card-footer">
                                        <div className="report-employee-meta">
                                            <span>ID: {machine.id}</span>
                                        </div>
                                        <button
                                            id="open-details"
                                            onClick={() => abrirModal(machine)}
                                            className="button button-outline task-details"
                                            disabled={machine.estado !== "Disponível"}
                                            type="button"
                                        >
                                            {machine.estado === "Disponível"
                                                ? "Solicitar"
                                                : machine.estado === "Solicitada"
                                                ? "Aguardando Aprovação"
                                                : "Indisponível"}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {visibleMachines.length === 0 && (
                        <p className="employee-empty">
                            {view === "Apenas Disponíveis"
                                ? "Nenhuma máquina disponível no momento."
                                : "Nenhuma máquina cadastrada."}
                        </p>
                    )}

                    <div className="d-flex justify-content-between align-items-center w-full mt-3">
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
                </>
            )}

            {modal && (
                <div className="task-modal-overlay" onClick={fecharModal}>
                    <section
                        className="task-modal machine-request-modal"
                        aria-modal="true"
                        aria-labelledby="machine-modal-title"
                        role="dialog"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className="machine-modal-header">
                            <span className="machine-modal-icon"><Factory size={21} /></span>
                            <div>
                                <span className="machine-modal-eyebrow">Solicitação de equipamento</span>
                                <h2 id="machine-modal-title">{modal.nome}</h2>
                                <p>MAQ-{String(modal.id).padStart(3, "0")} <span>{modal.estado}</span></p>
                            </div>
                            <button className="machine-modal-close" onClick={fecharModal} type="button" aria-label="Fechar modal">
                                <X size={19} />
                            </button>
                        </header>

                        <form className="machine-request-form" onSubmit={enviarSolicitacao}>
                            <label className="machine-modal-field machine-modal-description" htmlFor="machine-request-description">
                                Descrição da solicitação <span aria-hidden="true">*</span>
                                <textarea
                                    id="machine-request-description"
                                    value={solicitacao.descricao}
                                    onChange={(event) => setSolicitacao((atual) => ({ ...atual, descricao: event.target.value }))}
                                    placeholder="Descreva a atividade que será realizada com a máquina."
                                    maxLength={300}
                                    rows={3}
                                    required
                                />
                            </label>

                            <div className="machine-modal-fields-grid">
                                <span className="machine-modal-period-label"><CalendarClock size={16} /> Período de uso</span>
                                <label className="machine-modal-field" htmlFor="machine-use-start">
                                    Início do uso <span aria-hidden="true">*</span>
                                    <input
                                        id="machine-use-start"
                                        type="datetime-local"
                                        value={solicitacao.inicioUso}
                                        onChange={(event) => setSolicitacao((atual) => ({ ...atual, inicioUso: event.target.value }))}
                                        required
                                    />
                                </label>
                                <label className="machine-modal-field" htmlFor="machine-use-end">
                                    Final do uso <span aria-hidden="true">*</span>
                                    <input
                                        id="machine-use-end"
                                        type="datetime-local"
                                        min={solicitacao.inicioUso || undefined}
                                        value={solicitacao.fimUso}
                                        onChange={(event) => setSolicitacao((atual) => ({ ...atual, fimUso: event.target.value }))}
                                        required
                                    />
                                </label>
                            </div>

                            <p className="machine-modal-note">
                                A descrição, quantidade e período servem para orientar esta solicitação. O serviço atual registra somente a atribuição da máquina.
                            </p>
                            {erroSolicitacao && <p className="machine-modal-error" role="alert">{erroSolicitacao}</p>}

                            <footer className="machine-modal-actions">
                                <button className="machine-modal-cancel" onClick={fecharModal} type="button" disabled={enviandoSolicitacao}>
                                    Cancelar
                                </button>
                                <button className="machine-modal-submit" type="submit" disabled={enviandoSolicitacao || modal.estado !== "Disponível"}>
                                    {enviandoSolicitacao ? "Enviando..." : "Solicitar máquina"}
                                </button>
                            </footer>
                        </form>
                    </section>
                </div>
            )}
        </section>
    );
}
