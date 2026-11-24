"use client";

import { useEffect, useMemo, useState } from "react";
import { Factory } from "lucide-react";

function getStatusClass(status) {
    if (status === "Em Operação") return "running";
    if (status === "Em Manutenção") return "maintenance";
    if (status === "Inativa") return "inactive";
    return "available";
}

export default function MachineUserView({machines, error, loading}) {
    const [view, setView] = useState("Todos");
    const [modal, setModal] = useState(null);
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
                                            <span className={`machine-situation ${getStatusClass(machine.estado)}`}>
                                                {machine.estado}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="report-card-footer">
                                        <div className="report-employee-meta">
                                            <span>ID: {machine.id}</span>
                                        </div>
                                        <button
                                        id="open-details"
                                        onClick={(e) => setModal(machine)}
                                        className="button button-outline task-details"
                                        disabled={getStatusClass(machine.estado) !== "available"}
                                        type="button"
                                        >
                                            {getStatusClass(machine.estado) === "available"
                                            ? "Solicitar"
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
                </>
            )}

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
                    <h2>Detalhes da Máquina</h2>
                    <div style={{ margin: "14px 0", display: "grid", gap: "8px" }}>
                        <p><strong>Equipamento:</strong> {modal.nome}</p>
                        <p><strong>Código:</strong> MAQ-{String(modal.id).padStart(3, "0")}</p>
                        <p><strong>Estado:</strong> {modal.estado}</p>
                        <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                            {modal.estado === "Disponível"
                                ? "Este equipamento está livre para alocação e operação."
                                : "Este equipamento encontra-se indisponível no momento."}
                        </p>
                    </div>
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