"use client"
import '../user.css';
import Header from "@/components/Header";
import SidebarUser from "@/components/Sidebar-user";
import PageHeading from '@/components/PageHeading';
import Footer from '@/components/Footer';
import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    CircleCheck,
    ClipboardList,
    Clock3,
    Factory,
    Send,
} from 'lucide-react';
import { fetchComAuth, getUsuarioLogado } from '@/utils/api';

const FORM_INICIAL = {
    tarefa_id: '',
    maquina_id: '',
    categoria: '',
    status: '',
    resultado: '',
    finalidade: '',
    motivo: '',
    observacoes: '',
};

const CATEGORIAS = ['Manutenção', 'Ocorrência', 'Desempenho', 'Treinamento'];
const STATUS_RELATORIO = ['Concluído', 'Em andamento', 'Indisponível', 'Pendente'];
const RESULTADOS = ['Aprovado', 'Com Ressalvas', 'Reprovado', 'Incompleto', 'Pendente'];

async function carregarDados(endpoint) {
    const resposta = await fetchComAuth(endpoint);
    const resultado = await resposta.json();
    if (!resposta.ok) {
        throw new Error(resultado.erro || 'Não foi possível carregar os dados.');
    }
    return resultado.dados || [];
}

function formatarData(data) {
    if (!data) return 'Data indisponível';
    const dataValida = new Date(data);
    if (Number.isNaN(dataValida.getTime())) return 'Data indisponível';
    return dataValida.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
}

export default function Tarefas(){
    const [usuario, setUsuario] = useState(null);
    const [tarefas, setTarefas] = useState([]);
    const [maquinas, setMaquinas] = useState([]);
    const [relatorios, setRelatorios] = useState([]);
    const [formulario, setFormulario] = useState(FORM_INICIAL);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    useEffect(() => {
        let ativo = true;

        async function carregarPagina() {
            const usuarioAtual = getUsuarioLogado();
            const [tarefasResult, maquinasResult, relatoriosResult] = await Promise.allSettled([
                carregarDados('/api/tarefas?pagina=1&limite=100'),
                carregarDados('/api/maquinas?pagina=1&limite=100'),
                carregarDados('/api/relatorios?pagina=1&limite=100'),
            ]);

            if (!ativo) return;

            setUsuario(usuarioAtual);
            if (tarefasResult.status === 'fulfilled') {
                setTarefas(tarefasResult.value.filter((tarefa) => tarefa.status !== 'Cancelada'));
            }
            if (maquinasResult.status === 'fulfilled') setMaquinas(maquinasResult.value);
            if (relatoriosResult.status === 'fulfilled') {
                const relatoriosDoUsuario = relatoriosResult.value.filter(
                    (relatorio) => Number(relatorio.usuario?.id) === Number(usuarioAtual?.id),
                );
                setRelatorios(relatoriosDoUsuario);
            }

            const falhas = [tarefasResult, maquinasResult, relatoriosResult]
                .filter((resultado) => resultado.status === 'rejected');
            if (falhas.length) setErro('Algumas informações não puderam ser carregadas. Atualize a página e tente novamente.');
            setCarregando(false);
        }

        carregarPagina();
        return () => { ativo = false; };
    }, []);

    const indicadores = useMemo(() => ({
        total: relatorios.length,
        emAberto: relatorios.filter((relatorio) => ['Pendente', 'Em andamento'].includes(relatorio.status)).length,
        concluidos: relatorios.filter((relatorio) => relatorio.status === 'Concluído').length,
        atencao: relatorios.filter((relatorio) => ['Reprovado', 'Com Ressalvas'].includes(relatorio.resultado)).length,
    }), [relatorios]);

    const relatoriosRecentes = useMemo(
        () => [...relatorios].sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em)).slice(0, 5),
        [relatorios],
    );

    function atualizarCampo(evento) {
        setFormulario((atual) => ({ ...atual, [evento.target.name]: evento.target.value }));
        setErro('');
        setSucesso('');
    }

    async function enviarRelatorio(evento) {
        evento.preventDefault();
        setErro('');
        setSucesso('');

        if (!usuario?.id) {
            setErro('Não foi possível identificar seu usuário. Entre novamente no sistema.');
            return;
        }

        setEnviando(true);
        try {
            const resposta = await fetchComAuth('/api/relatorios', {
                method: 'POST',
                body: JSON.stringify({
                    ...formulario,
                    tarefa_id: Number(formulario.tarefa_id),
                    usuario_id: Number(usuario.id),
                    maquina_id: formulario.maquina_id ? Number(formulario.maquina_id) : null,
                }),
            });
            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.erro || 'Não foi possível enviar o relatório.');
            }

            setRelatorios((atuais) => [resultado.dados, ...atuais]);
            setFormulario(FORM_INICIAL);
            setSucesso('Relatório enviado com sucesso.');
        } catch (erroEnvio) {
            setErro(erroEnvio.message || 'Não foi possível enviar o relatório.');
        } finally {
            setEnviando(false);
        }
    }

    return(
        <main className='user-page user-tasks-page'>
            <SidebarUser />
            <Header usuario={usuario?.nome ?? "Usuário não logado"} />
            <section className="user-content">
                <PageHeading
                    eyebrow="FACTORYFLOW / OPERAÇÃO"
                    title="Relatório de máquina e processo"
                    description="Registre a execução, o estado do equipamento e os resultados do processo."
                />

                <section className="user-task-metrics" aria-label="Resumo dos relatórios enviados">
                    <article className="user-task-metric">
                        <span className="user-task-metric-icon"><ClipboardList size={18} /></span>
                        <span className="user-task-metric-label">Relatórios enviados</span>
                        <strong>{carregando ? '...' : indicadores.total}</strong>
                    </article>
                    <article className="user-task-metric">
                        <span className="user-task-metric-icon is-warning"><Clock3 size={18} /></span>
                        <span className="user-task-metric-label">Em andamento</span>
                        <strong>{carregando ? '...' : indicadores.emAberto}</strong>
                    </article>
                    <article className="user-task-metric">
                        <span className="user-task-metric-icon is-success"><CircleCheck size={18} /></span>
                        <span className="user-task-metric-label">Concluídos</span>
                        <strong>{carregando ? '...' : indicadores.concluidos}</strong>
                    </article>
                    <article className="user-task-metric">
                        <span className="user-task-metric-icon is-alert"><AlertTriangle size={18} /></span>
                        <span className="user-task-metric-label">Precisam de atenção</span>
                        <strong>{carregando ? '...' : indicadores.atencao}</strong>
                    </article>
                </section>

                <div className="user-task-workspace">
                    <section className="user-task-panel" aria-labelledby="user-task-form-title">
                        <div className="user-task-panel-heading">
                            <span className="user-task-section-icon"><Activity size={19} /></span>
                            <div>
                                <h2 id="user-task-form-title">Novo relatório operacional</h2>
                                <p>Preencha os dados da tarefa e descreva o que aconteceu no processo.</p>
                            </div>
                        </div>

                        {carregando ? (
                            <p className="user-task-empty">Carregando tarefas e equipamentos...</p>
                        ) : (
                            <form className="user-task-form" onSubmit={enviarRelatorio}>
                                <div className="user-task-form-grid">
                                    <label className="user-task-field user-task-field-wide" htmlFor="tarefa_id">
                                        Tarefa relacionada <span aria-hidden="true">*</span>
                                        <select id="tarefa_id" name="tarefa_id" value={formulario.tarefa_id} onChange={atualizarCampo} required>
                                            <option value="">Selecione uma tarefa</option>
                                            {tarefas.map((tarefa) => (
                                                <option key={tarefa.id} value={tarefa.id}>
                                                    {tarefa.codigo} · {tarefa.titulo}
                                                </option>
                                            ))}
                                        </select>
                                        <small>Escolha uma tarefa vinculada ao seu usuário. O sistema valida essa associação ao enviar.</small>
                                    </label>

                                    <label className="user-task-field" htmlFor="maquina_id">
                                        Máquina
                                        <select id="maquina_id" name="maquina_id" value={formulario.maquina_id} onChange={atualizarCampo}>
                                            <option value="">Sem máquina específica</option>
                                            {maquinas.map((maquina) => (
                                                <option key={maquina.id} value={maquina.id}>
                                                    {maquina.nome}{maquina.codigo ? ` · ${maquina.codigo}` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="user-task-field" htmlFor="categoria">
                                        Categoria <span aria-hidden="true">*</span>
                                        <select id="categoria" name="categoria" value={formulario.categoria} onChange={atualizarCampo} required>
                                            <option value="">Selecione a categoria</option>
                                            {CATEGORIAS.map((categoria) => <option key={categoria}>{categoria}</option>)}
                                        </select>
                                    </label>

                                    <label className="user-task-field" htmlFor="status">
                                        Status do relatório <span aria-hidden="true">*</span>
                                        <select id="status" name="status" value={formulario.status} onChange={atualizarCampo} required>
                                            <option value="">Selecione o status</option>
                                            {STATUS_RELATORIO.map((status) => <option key={status}>{status}</option>)}
                                        </select>
                                    </label>

                                    <label className="user-task-field" htmlFor="resultado">
                                        Resultado do processo <span aria-hidden="true">*</span>
                                        <select id="resultado" name="resultado" value={formulario.resultado} onChange={atualizarCampo} required>
                                            <option value="">Selecione o resultado</option>
                                            {RESULTADOS.map((resultado) => <option key={resultado}>{resultado}</option>)}
                                        </select>
                                    </label>

                                    <label className="user-task-field user-task-field-wide" htmlFor="finalidade">
                                        Objetivo da operação <span aria-hidden="true">*</span>
                                        <input
                                            id="finalidade"
                                            name="finalidade"
                                            value={formulario.finalidade}
                                            onChange={atualizarCampo}
                                            placeholder="Ex.: inspeção preventiva da linha de envase"
                                            maxLength={255}
                                            required
                                        />
                                        <small>{formulario.finalidade.length}/255 caracteres</small>
                                    </label>

                                    <label className="user-task-field user-task-field-wide" htmlFor="observacoes">
                                        Descrição do processo <span aria-hidden="true">*</span>
                                        <textarea
                                            id="observacoes"
                                            name="observacoes"
                                            value={formulario.observacoes}
                                            onChange={atualizarCampo}
                                            placeholder="Descreva as etapas realizadas, condições observadas e resultado da operação."
                                            rows={5}
                                            required
                                        />
                                    </label>

                                    <label className="user-task-field user-task-field-wide" htmlFor="motivo">
                                        Ocorrência ou motivo de parada
                                        <textarea
                                            id="motivo"
                                            name="motivo"
                                            value={formulario.motivo}
                                            onChange={atualizarCampo}
                                            placeholder="Informe falhas, interrupções ou motivo da indisponibilidade, se houver."
                                            rows={3}
                                        />
                                    </label>
                                </div>

                                {erro && <p className="user-task-feedback is-error" role="alert">{erro}</p>}
                                {sucesso && <p className="user-task-feedback is-success" role="status">{sucesso}</p>}

                                <div className="user-task-form-footer">
                                    <p><Factory size={16} /> Os dados serão registrados no histórico da operação.</p>
                                    <button className="user-task-submit" type="submit" disabled={enviando || tarefas.length === 0}>
                                        <Send size={16} />
                                        {enviando ? 'Enviando...' : 'Enviar relatório'}
                                    </button>
                                </div>
                                {!carregando && tarefas.length === 0 && (
                                    <p className="user-task-feedback is-error" role="status">Nenhuma tarefa disponível para selecionar.</p>
                                )}
                            </form>
                        )}
                    </section>

                    <aside className="user-task-panel user-task-history" aria-labelledby="user-task-history-title">
                        <div className="user-task-panel-heading">
                            <span className="user-task-section-icon"><Clock3 size={19} /></span>
                            <div>
                                <h2 id="user-task-history-title">Atividade recente</h2>
                                <p>Seus últimos registros enviados.</p>
                            </div>
                        </div>
                        {carregando ? (
                            <p className="user-task-empty">Carregando histórico...</p>
                        ) : relatoriosRecentes.length ? (
                            <div className="user-task-activity-list">
                                {relatoriosRecentes.map((relatorio) => (
                                    <article className="user-task-activity" key={relatorio.id}>
                                        <div className="user-task-activity-topline">
                                            <strong>{relatorio.tarefa?.codigo || `Relatório #${relatorio.id}`}</strong>
                                            <span>{formatarData(relatorio.criado_em)}</span>
                                        </div>
                                        <p>{relatorio.finalidade || relatorio.categoria}</p>
                                        <div className="user-task-activity-meta">
                                            <span>{relatorio.maquina?.nome || 'Sem máquina vinculada'}</span>
                                            <span className={`user-task-status ${relatorio.status === 'Concluído' ? 'is-complete' : 'is-pending'}`}>
                                                {relatorio.status}
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p className="user-task-empty">Seus relatórios enviados aparecerão aqui.</p>
                        )}
                    </aside>
                </div>

                <Footer />
            </section>
        </main>
    )
}