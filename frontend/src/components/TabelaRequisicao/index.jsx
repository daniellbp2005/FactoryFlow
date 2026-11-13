"use client";

import { Search, Siren, Check, X } from "lucide-react";

export default function RequisicaoMaquinas() {
    return (
        <div className="requisicao-maquinas">
            <div className="requisicao-page">
                <section className="panel report-list-panel" aria-labelledby="report-list-title">
                    <div className="panel-heading report-list-heading">
                        <div>
                            <h2 id="report-list-title">Requisição de Máquinas</h2>
                            <p>
                                3 de 3 registros
                            </p>
                        </div>
                        <label className="report-search">
                            <Search size={15} aria-hidden="true" />
                            <span className="sr-only">Buscar relatório de operador</span>
                            <input
                                placeholder="Buscar operador ou relatório"
                                type="search"
                            />
                        </label>
                    </div>


                    <div className="report-lists">
                        <article className="report-card">
                            <span className="report-icon" aria-hidden="true">
                                <Siren color="#00ffe5" size={17} />
                            </span>
                            <div className="report-card-content">
                                <div className="report-card-heading">
                                    <div>
                                        <strong>Arthur Silva</strong>
                                        <span className="report-type">Funcionário</span>
                                    </div>
                                    <div className="column">
                                        <span>06/11/2026- 09:00 - 12:00</span>
                                        <div>
                                            <div className="report-status review fit">
                                                Pendente
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="requisicao-text">
                                    <p>Produção de Lote</p>
                                </div>
                                <div className="report-card-footer">
                                    <div className="report-employee-meta">
                                        <span>REQ-1085</span>
                                        <span>Código: CNC-01</span>
                                    </div>
                                    <div className="btns">
                                        <button className="btn-editar"><Check />Aprovar</button>
                                        <button className="btn-excluir"><X />Recusar</button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div className="report-lists">
                        <article className="report-card">
                            <span className="report-icon" aria-hidden="true">
                                <Siren color="#00ffe5" size={17} />
                            </span>
                            <div className="report-card-content">
                                <div className="report-card-heading">
                                    <div>
                                        <strong>Adamastor</strong>
                                        <span className="report-type">Funcionário</span>
                                    </div>
                                    <div className="column">
                                        <span>06/11/2026- 09:00 - 12:00</span>
                                        <div>
                                            <div className="report-status complete fit">
                                                Aprovado
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="requisicao-text">
                                    <p>Produção de Lote</p>
                                </div>
                                <div className="report-card-footer">
                                    <div className="report-employee-meta">
                                        <span>REQ-1086</span>
                                        <span>Código: CNC-02</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div className="report-list">
                        <article className="report-card">
                            <span className="report-icon" aria-hidden="true">
                                <Siren color="#00ffe5" size={17} />
                            </span>
                            <div className="report-card-content">
                                <div className="report-card-heading">
                                    <div>
                                        <strong>Juliema</strong>
                                        <span className="report-type">Funcionário</span>
                                    </div>
                                    <div className="column">
                                        <span>06/11/2026- 09:00 - 12:00</span>
                                        <div>
                                            <div className="report-status denied fit">
                                                Reprovado
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="requisicao-text">
                                    <p>Produção de Lote</p>
                                </div>
                                <div className="report-card-footer">
                                    <div className="report-employee-meta">
                                        <span>REQ-1087</span>
                                        <span>Código: CNC-03</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>
            </div>
        </div>
    );
}
