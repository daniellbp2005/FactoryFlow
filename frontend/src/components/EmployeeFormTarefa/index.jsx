"use client";

import { useState, useEffect } from "react";
import { Plus, X, Mail, Wrench, Users, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { fetchComAuth } from "@/utils/api";

export default function EmployeeFormTarefas({ onSuccess }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [setor, setSetor] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [periodo, setPeriodo] = useState("Semana");
  const [turno_prazo, setTurnoPrazo] = useState("Manhã");
  const [prazo, setPrazo] = useState("");
  const [tempo_estimado, setTempoEstimado] = useState("");
  const [emails, setEmail] = useState([""]);
  const [equipamentos, setEquipamentos] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [listaEquipamentos, setListaEquipamentos] = useState([]);

  // --- Gerenciamento Dinâmico de E-mails ---
  function adicionarEmail() {
    setEmail((prev) => [...prev, ""]);
  }

  function alterarEmail(index, valor) {
    const novos = [...emails];
    novos[index] = valor;
    setEmail(novos);
  }

  function deletarInputEmail(index) {
    if (emails.length <= 1) {
      setEmail([""]);
      return;
    }
    setEmail(emails.filter((_, i) => i !== index));
  }

  // --- Gerenciamento Dinâmico de Equipamentos ---
  function adicionarMaq() {
    setEquipamentos((prev) => [...prev, ""]);
  }

  function alterarMaq(index, valor) {
    const novos = [...equipamentos];
    novos[index] = valor;
    setEquipamentos(novos);
  }

  function deletarInputMaq(index) {
    if (equipamentos.length <= 1) {
      setEquipamentos([""]);
      return;
    }
    setEquipamentos(equipamentos.filter((_, i) => i !== index));
  }

  // --- Carregar Equipamentos da API ---
  useEffect(() => {
    async function buscarEquipamentos() {
      try {
        const resposta = await fetchComAuth("/api/equipamentos/");
        const resultado = await resposta.json();

        if (!resposta.ok) {
          throw new Error("Erro ao buscar equipamentos.");
        }

        setListaEquipamentos(resultado.dados || []);
      } catch (e) {
        console.error("Erro ao carregar equipamentos:", e.message);
      }
    }

    buscarEquipamentos();
  }, []);

  // --- Submissão do Formulário ---
  async function onClickCriar(e) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(false);

    try {
      const emailsValidos = emails
        .map((email) => email.trim())
        .filter((email) => email !== "");

      const equipamentosValidos = equipamentos
        .filter((id) => id !== "")
        .map(Number);

      const resposta = await fetchComAuth("/api/tarefas/", {
        method: "POST",
        body: JSON.stringify({
          titulo,
          descricao,
          setor,
          prioridade,
          status: status || "Pendente",
          periodo: periodo || "Semana",
          turno_prazo: turno_prazo || "Indefinido",
          prazo: prazo || null,
          tempo_estimado,
          iniciado_em: null,
          finalizado_em: null,
          emails: emailsValidos,
          equipamentos: equipamentosValidos,
        }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.detalhes || resultado.erro || resultado.message || "Erro ao criar tarefa.");
      }

      onSuccess?.(resultado);

      // Limpar formulário
      setTitulo("");
      setDescricao("");
      setSetor("");
      setPrioridade("");
      setStatus("Pendente");
      setPeriodo("Semana");
      setTurnoPrazo("Manhã");
      setPrazo("");
      setTempoEstimado("");
      setEmail([""]);
      setEquipamentos([""]);
      setSucesso(true);

      setTimeout(() => setSucesso(false), 4000);
    } catch (e) {
      setErro(e.message);
      console.error("Erro ao criar a tarefa:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel employee-form-panel" aria-labelledby="employee-form-title">
      <div className="panel-heading">
        <div>
          <h2 id="employee-form-title">Nova Tarefa</h2>
          <p>Preencha os dados da ordem de produção / serviço.</p>
        </div>
      </div>

      <form className="employee-form" onSubmit={onClickCriar}>
        {/* Título da Tarefa */}
        <label>
          Título da Tarefa
          <input
            maxLength={100}
            name="titulo"
            placeholder="Ex: Manutenção Preventiva da Prensa Hidráulica"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </label>

        {/* Setor e Prioridade */}
        <div className="form-row">
          <label>
            Setor
            <select
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
              required
            >
              <option disabled value="">Selecione o setor</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Pintura">Pintura</option>
              <option value="Automação">Automação</option>
              <option value="Qualidade">Qualidade</option>
              <option value="Usinagem">Usinagem</option>
              <option value="Solda">Solda</option>
              <option value="Montagem">Montagem</option>
            </select>
          </label>

          <label>
            Prioridade
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
              required
            >
              <option disabled value="">Selecione a prioridade</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </label>
        </div>

        {/* Descrição */}
        <label>
          Descrição Detalhada
          <textarea
            maxLength={300}
            name="descricao"
            placeholder="Descreva o procedimento, problemas identificados ou instruções..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </label>

        {/* Prazo e Duração Estimada */}
        <div className="form-row">
          <label>
            Prazo de Conclusão
            <input
              type="datetime-local"
              value={prazo}
              onChange={(e) => setPrazo(e.target.value)}
              required
            />
          </label>

          <label>
            Duração Estimada (horas)
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Ex: 3.5"
              value={tempo_estimado}
              onChange={(e) => setTempoEstimado(e.target.value)}
              required
            />
          </label>
        </div>

        {/* Turno do Prazo e Planejamento */}
        <div className="form-row">
          <label>
            Turno Limite
            <select
              value={turno_prazo}
              onChange={(e) => setTurnoPrazo(e.target.value)}
            >
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
              <option value="Indefinido">Indefinido</option>
            </select>
          </label>

          <label>
            Período
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            >
              <option value="Dia">Dia</option>
              <option value="Semana">Semana</option>
              <option value="Mês">Mês</option>
            </select>
          </label>
        </div>

        {/* Responsáveis (E-mails) */}
        <div className="form-section">
          <div className="form-section-header">
            <span className="form-section-title">
              <Users size={15} /> Responsáveis Atribuídos
            </span>
            <button
              type="button"
              className="btn-add-item"
              onClick={adicionarEmail}
            >
              <Plus size={14} /> Adicionar E-mail
            </button>
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            {emails.map((email, index) => (
              <div key={index} className="dynamic-input-row">
                <div className="input-with-icon">
                  <Mail size={15} />
                  <input
                    type="email"
                    name={`email_${index}`}
                    placeholder="Ex: carlos.silva@factoryflow.com"
                    value={email}
                    onChange={(e) => alterarEmail(index, e.target.value)}
                  />
                </div>
                {emails.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={() => deletarInputEmail(index)}
                    title="Remover e-mail"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Equipamentos Atribuídos */}
        <div className="form-section">
          <div className="form-section-header">
            <span className="form-section-title">
              <Wrench size={15} /> Equipamentos Atribuídos
            </span>
            <button
              type="button"
              className="btn-add-item"
              onClick={adicionarMaq}
            >
              <Plus size={14} /> Adicionar Equipamento
            </button>
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            {equipamentos.map((equipamento, index) => (
              <div key={index} className="dynamic-input-row">
                <select
                  value={equipamento}
                  name={`maq_${index}`}
                  onChange={(e) => alterarMaq(index, e.target.value)}
                >
                  <option value="">Selecione um equipamento...</option>
                  {listaEquipamentos.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome} {item.marca ? `— ${item.marca}` : ""}
                    </option>
                  ))}
                </select>

                {equipamentos.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={() => deletarInputMaq(index)}
                    title="Remover equipamento"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mensagens de Feedback */}
        {erro && (
          <div className="form-alert form-alert-error" role="alert">
            <AlertCircle size={17} />
            <span>{erro}</span>
          </div>
        )}

        {sucesso && (
          <div className="form-alert form-alert-success" role="status">
            <CheckCircle2 size={17} />
            <span>Tarefa cadastrada com sucesso!</span>
          </div>
        )}

        {/* Botão de Envio */}
        <button
          className={`button button-primary ${loading ? "button-loading" : ""}`}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="spinner" />
              Cadastrando Tarefa...
            </>
          ) : (
            "Cadastrar Tarefa"
          )}
        </button>
        {sucesso && (
          <div className="form-alert form-alert-success" style={{ marginTop: "12px" }}>
            <CheckCircle2 size={16} />
            <span>Máquina cadastrada com sucesso!</span>
          </div>
        )}

        {erro && (
          <div className="form-alert form-alert-error" style={{ marginTop: "12px" }}>
            <AlertCircle size={16} />
            <span>{erro}</span>
          </div>
        )}
      </form>
    </section>
  );
}
