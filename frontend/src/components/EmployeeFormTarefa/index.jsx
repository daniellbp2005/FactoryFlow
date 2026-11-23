"use client";
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { fetchComAuth } from '@/utils/api';

export default function EmployeeFormTarefas() {

    const [inputsMaq, setInputsMaq] = useState([""]);
    const [inputs, setInputs] = useState([""]);

    function adicionarEmail() {
        setInputs([...inputs, inputs.length + 1]);
    }

    function alterarEmail(index, valor) {
        const novosEmails = [...emails];
        novosEmails[index] = valor;
        setEmail(novosEmails);
    }

    function deletarInputEmail() {
        setInputs(inputs.slice(0, -1));
    }

    function adicionarMaq() {
        setInputsMaq([...inputsMaq, inputsMaq.length + 1]);
    }

    function alterarMaq(index, valor) {
        const novosEquipamentos = [...equipamentos];
        novosEquipamentos[index] = valor;
        setEquipamentos(novosEquipamentos);
    }

    function deletarInputMaq() {
        setInputsMaq(inputsMaq.slice(0, -1));
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
    const [finalizado_em, setFinalizadoEm] = useState("");
    const [emails, setEmail] = useState([""]);
    const [equipamentos, setEquipamentos] = useState([""]);

    async function onClickCriar(e) {
        e.preventDefault();
        try {
            await criarTarefa()
        } catch (e) {
            console.error("Erro ao criar a tarefa", e.message);
        }
    }


    async function criarTarefa() {
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
                emails,
                equipamentos
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao criar tarefa.");
        }

        console.log("Tarefa criada:", resultado.dados);

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
                {/* <p className='fs-5 fw-bold mt-2'>O funcionário tem um grupo ? Adicione ele aqui.</p> */}

                <label id='EmailCriar'>
                    <div className='d-flex justify-content-center align-items-center gap-2 py-0'>
                        <p className='w-75 px-0 fs-0'>E-mail</p>
                        <div className='add-email w-25 ' onClick={adicionarEmail}>
                            <Plus />
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center gap-2 flex-column'>
                        <input
                            type="email"
                            name="email_0"
                            placeholder="Ex: admin@factoryflow.com"
                            onChange={(e) => alterarEmail(0, e.target.value)}
                        />
                        {inputs.map((email, index) => (
                            <div key={index} className='d-flex justify-content-center align-items-center gap-2 w-100'>
                                <input
                                    key={index}
                                    type="email"
                                    name={`input_${index}`}
                                    value={email}
                                    placeholder="Ex: admin@factoryflow.com"
                                    onChange={(e) => alterarEmail(index, e.target.value)}
                                />
                                <X className='cursor-pointer' onClick={() => deletarInputEmail()} />
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
                        <input
                            type="number"
                            min="1"
                            name="maq_0"
                            placeholder="ID do equipamento"
                            value={equipamentos[0]}
                            onChange={(e) => alterarMaq(0, e.target.value)}
                        />
                        {inputsMaq.map((maquina, index) => (
                            <div key={index} className='d-flex justify-content-center align-items-center gap-2 w-100'>
                                <input
                                    key={index}
                                    type="text"
                                    value={maquina}
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
                    <div className="d-flex align-itmes-center justify-content-center gap-3 w-full">
                        <div className='w-full col-6 ps-2'>
                            Hora de entrega
                            <input
                                name="role"
                                type='time'
                                placeholder="Digite o prazo da tarefa"
                                minLength={3}
                                maxLength={80}
                                value={tempo_estimado}
                                onChange={(e) => setTempoEstimado(e.target.value)}
                                required
                            />
                        </div>
                        <div className='w-full col-6 pe-2'>
                            Hora final da tarefa
                            <input
                                name="role"
                                type='time'
                                placeholder="Digite o prazo final da tarefa"
                                minLength={14}
                                maxLength={14}
                                value={finalizado_em}
                                onChange={(e) => setFinalizadoEm(e.target.value)}
                                required
                            />
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


                <button className="button button-primary" type="submit">
                    Cadastrar Tarefa
                </button>
            </form>
        </section>
    );
}
