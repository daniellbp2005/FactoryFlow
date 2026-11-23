"use client";
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { fetchComAuth } from '@/utils/api';

export default function EmployeeFormTarefas({ onSuccess }) {
    function adicionarEmail() {
        setEmail([...emails, ""]);
    }

    function alterarEmail(index, valor) {
        const novosEmails = [...emails];
        novosEmails[index] = valor;
        setEmail(novosEmails);
    }

    function deletarInputEmail() {
        setEmail(emails.slice(0, -1));
    }

    function adicionarMaq() {
        setEquipamentos([...equipamentos, ""]);
    }

    function alterarMaq(index, valor) {
        const novosEquipamentos = [...equipamentos];
        novosEquipamentos[index] = valor;
        setEquipamentos(novosEquipamentos);
    }

    function deletarInputMaq() {
        setEquipamentos(equipamentos.slice(0, -1));
    }

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [setor, setSetor] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [status, setStatus] = useState("");
    const [periodo, setPeriodo] = useState(null);
    const [turno_prazo, setTurnoPrazo] = useState("");
    const [prazo, setPrazo] = useState("");
    const [tempo_estimado, setTempoEstimado] = useState("");
    const [emails, setEmail] = useState([""]);
    const [equipamentos, setEquipamentos] = useState([""]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null)

    async function onClickCriar(e) {
        e.preventDefault();
        try {
            await criarTarefa()
        } catch (e) {
            console.log("Erro ao criar a tarefa", e.message);
        }
    }

    async function criarTarefa() {
        setLoading(true);
        setErro(null)
        try {
            const emailsValidos = emails
                .map(email => email.trim())
                .filter(email => email !== "");

            const equipamentosValidos = equipamentos
                .filter(id => id !== "")
                .map(Number);
            const resposta = await fetchComAuth("/api/tarefas/", {
                method: "POST",
                body: JSON.stringify({
                    titulo,
                    descricao,
                    setor,
                    prioridade,
                    status,
                    periodo,
                    turno_prazo,
                    prazo,
                    tempo_estimado,
                    iniciado_em: null,
                    finalizado_em: null,
                    emails: emailsValidos,
                    equipamentos: equipamentosValidos
                })
            })

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.erro || "Erro ao criar tarefa.");
            }

            onSuccess?.(resultado);

            console.log("Tarefa criada:", resultado.dados);
            setTitulo("");
            setDescricao("");
            setSetor("");
            setPrioridade("");
            setStatus("");
            setPrioridade("");
            setSetor("");
            setPeriodo("");
            setTurnoPrazo("");
            setPrazo("");
            setTempoEstimado("");
            setEmail([""]);
            setEquipamentos([""]);
        } catch (e) {
            setErro(e.message)
        } finally {
            setLoading(false)
        }
        return resultado;
    }

    return (
        <section className="panel employee-form-panel" aria-labelledby="employee-form-title">
            <div className="panel-heading">
                <div>
                    <h2 id="employee-form-title">Nova Tarefa</h2>
                    <p>Preencha os dados para adicionar à equipe.</p>
                </div>
            </div>

            <form className="employee-form" onSubmit={onClickCriar}>
                <label>
                    Titulo
                    <input
                        autoComplete="name"
                        maxLength={100}
                        name="name"
                        placeholder="Ex: Inspeção da Prensa Hidráulica"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                    />
                </label>
                <label id='EmailCriar'>
                    <div className='d-flex justify-content-center align-items-center gap-2 py-0'>
                        <p className='w-75 px-0 fs-0'>E-mail</p>
                        <div className='add-email w-25 ' onClick={adicionarEmail}>
                            <Plus />
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center gap-2 flex-column'>
                        {emails.map((email, index) => (
                            <div key={index} className='d-flex justify-content-center align-items-center gap-2 w-100'>
                                <input
                                    type="email"
                                    name={`email_${index}`}
                                    placeholder="Ex: admin@factoryflow.com"
                                    value={email}
                                    onChange={(e) => alterarEmail(index, e.target.value)}
                                />
                                <X
                                    className='cursor-pointer'
                                    onClick={() => deletarInputEmail(index)}
                                />
                            </div>
                        ))}
                    </div>
                </label>

                <label id='maquinasAdd'>
                    <div className='d-flex justify-content-center align-items-center gap-2 py-0'>
                        <p className='w-75 px-0 fs-0'>Equipamentos Atribuidos</p>
                        <div className='add-email w-25 ' onClick={adicionarMaq}>
                            <Plus />
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center gap-2 flex-column'>
                        {equipamentos.map((equipamento, index) => (
                            <div key={index} className='d-flex justify-content-center align-items-center gap-2 w-100'>
                                <input
                                    type="number"
                                    value={equipamento}
                                    name={`maq_${index}`}
                                    placeholder="Tipo de maquina"
                                    onChange={(e) => alterarMaq(index, e.target.value)}
                                />
                                <X className='cursor-pointer' onClick={() => deletarInputMaq()} />
                            </div>
                        ))}
                    </div>
                </label>

                <label>
                    Descrição
                    <textarea
                        autoComplete="email"
                        maxLength={300}
                        name="descricao"
                        placeholder="Checagem de vazamento no pistão de 200 toneladas e análise química do óleo mineral."
                        type="email"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        required
                    />
                </label>

                <label>
                    <div className="d-flex gap-3">
                        <div className="d-flex justify-content-center align-items-center">
                            <div className='d-flex justify-content-center align-items-center flex-column w-50'>
                                <p>Prazo de entrega</p>
                                <input
                                    type="datetime-local"
                                    value={prazo}
                                    onChange={(e) => setPrazo(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='d-flex justify-content-center align-items-center flex-column w-50'>
                                <p>Duração estimada (horas)</p>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="Ex: 3.5"
                                    value={tempo_estimado}
                                    onChange={(e) => setTempoEstimado(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </label>
                <label>
                    <div className="d-flex align-itmes-center justify-content-center gap-3 w-full ">
                        <div className='w-full col-6 ps-2'>
                            Prioridade
                            <select name="shift" className="form-select w-100" value={prioridade} onChange={(e) => setPrioridade(e.target.value)} required>
                                <option disabled value="">Selecione uma prioridade</option>
                                <option value="Baixa">Baixa</option>
                                <option value="Média">Média</option>
                                <option value="Alta">Alta</option>
                            </select>
                        </div>
                        <div className='w-full col-6 pe-2'>
                            Setor
                            <select name="shift" className="form-select w-100" value={setor} onChange={(e) => setSetor(e.target.value)} required>
                                <option disabled value="">Selecione um setor</option>
                                <option value="Manutenção">Manutenção</option>
                                <option value="Pintura">Pintura</option>
                                <option value="Automação">Automação</option>
                                <option value="Qualidade">Qualidade</option>
                                <option value="Usinagem">Usinagem</option>
                                <option value="Solda">Solda</option>
                                <option value="Manutenção">Manutenção</option>
                                <option value="Montagem">Montagem</option>
                            </select>
                        </div>
                    </div>
                </label>


                <button className="button button-primary" type="submit" disabled={loading}>
                    {loading ? "Cadastrando Tarefa" : "Cadastrar"}
                </button>
                {erro && <p className='fs-4'>{erro}</p>}
            </form>
        </section>
    );
}
