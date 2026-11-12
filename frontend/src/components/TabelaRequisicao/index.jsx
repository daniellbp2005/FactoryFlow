"use client";

import "./requisicao.css";
import { ClipboardList, Siren, Check, X } from "lucide-react";

export default function RequisicaoMaquinas() {
    return (
        <div className="requisicao-maquinas">
            <div className="requisicao-page">
                <div className="requisicao-header">
                    <h2>Requisição de Máquinas</h2>
                    <p>Esta é a página de requisição de máquinas.</p>
                </div>

                <div className="requisicao-user">
                    <div className="container">
                        <div className="container-icon"><Siren color="#00ffe5" /></div>
                        <div className="container-info-user">
                            <div className="container-info">
                                <h8>Arthur Silva</h8>
                                <div className="container-text">
                                    <p>REQ-1062</p>
                                    <p>·</p>
                                    <p>CNC-04</p>
                                </div>
                            </div>
                        </div>
                        <div className="status">Pendente</div>
                    </div>

                    <hr />

                    <div className="conjunto-info">
                        <div className="data-solicitada">
                            <h8 className="h8">Data da Solicitação</h8>
                            <p className="p">06/11/2026</p>
                        </div>

                        <div className="horario">
                            <h8 className="h8">Horário</h8>
                            <p className="p">09:00 - 12:00</p>
                        </div>
                        <div className="finalidade">
                            <h8 className="h8">Finalidade</h8>
                            <p className="p">Produção lote</p>
                        </div>
                        <div className="setor">
                            <h8 className="h8">Setor</h8>
                            <p className="p">Usinagem</p>
                        </div>
                    </div>

                    <div className="btns">
                        <button className="btn-editar"><Check />Aprovar</button>
                        <button className="btn-excluir"><X />Recusar</button>
                    </div>
                </div>

                <div className="requisicao-user">

                    <div className="container">
                        <div className="container-icon"><Siren color="#00ffe5" /></div>
                        <div className="container-info-user">
                            <div className="container-info">
                                <h8>Adamastor</h8>
                                <div className="container-text">
                                    <p>REQ-1086</p>
                                    <p>·</p>
                                    <p>CNC-01</p>
                                </div>
                            </div>
                        </div>
                        <div className="status-aprovado">Aprovado</div>
                    </div>

                    <hr />

                    <div className="conjunto-info">

                        <div className="data-solicitada">
                            <h8 className="h8">Data da Solicitação</h8>
                            <p className="p">09/11/2026</p>
                        </div>

                        <div className="horario">
                            <h8 className="h8">Horário</h8>
                            <p className="p">07:00 - 11:00</p>
                        </div>
                        <div className="finalidade">
                            <h8 className="h8">Finalidade</h8>
                            <p className="p">Produção lote</p>
                        </div>
                        <div className="setor">
                            <h8 className="h8">Setor</h8>
                            <p className="p">Usinagem</p>
                        </div>

                    </div>

                </div>

                <div className="requisicao-user">

                    <div className="container">
                        <div className="container-icon"><Siren color="#00ffe5" /></div>
                        <div className="container-info-user">
                            <div className="container-info">
                                <h8>Juliema</h8>
                                <div className="container-text">
                                    <p>REQ-1050</p>
                                    <p>·</p>
                                    <p>CNC-03</p>
                                </div>
                            </div>
                        </div>
                        <div className="status-reprovado">Reprovado</div>
                    </div>

                    <hr />

                    <div className="conjunto-info">

                        <div className="data-solicitada">
                            <h8 className="h8">Data da Solicitação</h8>
                            <p className="p">08/11/2026</p>
                        </div>

                        <div className="horario">
                            <h8 className="h8">Horário</h8>
                            <p className="p">07:40 - 13:00</p>
                        </div>
                        <div className="finalidade">
                            <h8 className="h8">Finalidade</h8>
                            <p className="p">Produção lote</p>
                        </div>
                        <div className="setor">
                            <h8 className="h8">Setor</h8>
                            <p className="p">Usinagem</p>
                        </div>

                    </div>

                </div>


            </div>
        </div>
    );
}
