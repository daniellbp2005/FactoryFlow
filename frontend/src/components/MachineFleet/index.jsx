"use client";

import { useMemo, useState, useEffect } from "react";
import { Factory, Plus, Search, Wrench, X } from "lucide-react";
import { fetchComAuth } from "@/utils/api";

function getStatusClass(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("operação") || s.includes("operacao")) return "running";
  if (s.includes("manutenção") || s.includes("manutencao")) return "maintenance";
  return "available";
}

function inferCategoryAndImage(nome = "") {
  const n = nome.toLowerCase();
  if (n.includes("corte") || n.includes("laser")) {
    return { category: "Corte", image: "laser", type: "Corte a laser CNC" };
  }
  if (n.includes("torno")) {
    return { category: "Usinagem", image: "lathe", type: "Torno CNC" };
  }
  if (n.includes("fresadora")) {
    return { category: "Usinagem", image: "mill", type: "Fresadora industrial" };
  }
  return { category: "Usinagem", image: "cnc", type: "Centro de usinagem CNC" };
}

function MachineIllustration({ variant }) {
  return (
    <svg
      aria-hidden="true"
      className={`machine-illustration machine-illustration-${variant}`}
      fill="none"
      viewBox="0 0 320 180"
    >
      <defs>
        <linearGradient id={`machine-metal-${variant}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#69777e" />
          <stop offset="1" stopColor="#303a40" />
        </linearGradient>
        <linearGradient id={`machine-window-${variant}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#193b3b" />
          <stop offset="1" stopColor="#101d22" />
        </linearGradient>
      </defs>
      <ellipse cx="157" cy="158" rx="127" ry="10" fill="#080b0d" opacity=".7" />
      <path d="M37 136h226v18H37z" fill="#273137" stroke="#718087" strokeWidth="2" />
      <path d="M48 53a9 9 0 0 1 9-9h151a9 9 0 0 1 9 9v82H48z" fill={`url(#machine-metal-${variant})`} stroke="#849198" strokeWidth="2" />
      <path d="M60 62a5 5 0 0 1 5-5h91a5 5 0 0 1 5 5v57H60z" fill={`url(#machine-window-${variant})`} stroke="#8da1a5" strokeWidth="2" />
      <path d="M168 65h37v67h-37z" fill="#263238" stroke="#77848a" strokeWidth="2" />
      <path d="M177 78h20v34h-20z" fill="#11181c" stroke="#44545b" />
      <path d="M43 134h174v8H43z" fill="#10b8a8" opacity=".8" />
      {variant === "cnc" && (
        <>
          <path d="M102 57v13h19v12h-8v22h-7V82h-8V70h-8V57z" fill="#aebbc0" />
          <path d="M107 103h7v17h-7z" fill="#10b8a8" />
          <path d="M76 121h75" stroke="#63747b" strokeWidth="3" />
        </>
      )}
      {variant === "lathe" && (
        <>
          <path d="M77 88h61v10H77z" fill="#aebbc0" />
          <path d="M96 98v20m24-20v20" stroke="#c1cccf" strokeWidth="4" />
          <circle cx="102" cy="93" r="13" stroke="#10b8a8" strokeWidth="3" />
          <path d="M83 120h55" stroke="#63747b" strokeWidth="3" />
        </>
      )}
      {variant === "mill" && (
        <>
          <path d="M98 57h18v20h-5v31h-8V77h-5z" fill="#aebbc0" />
          <path d="M89 109h36v8H89z" fill="#10b8a8" />
          <path d="M80 121h68" stroke="#63747b" strokeWidth="3" />
          <path d="M115 108l7 6-7 6" stroke="#d09c4b" strokeWidth="2" />
        </>
      )}
      {variant === "laser" && (
        <>
          <path d="M101 57h22v13h-6v32h-10V70h-6z" fill="#aebbc0" />
          <path d="M112 102v17" stroke="#ff6d63" strokeWidth="3" />
          <path d="M90 123h48" stroke="#63747b" strokeWidth="3" />
          <path d="M103 123l9-10 9 10" stroke="#ff6d63" strokeWidth="2" />
        </>
      )}
      <rect x="231" y="69" width="31" height="48" rx="3" fill="#222c31" stroke="#87949a" strokeWidth="2" />
      <rect x="236" y="75" width="21" height="13" rx="2" fill="#102d2b" stroke="#10b8a8" />
      <path d="M239 98h4m4 0h4m-12 7h4m4 0h4" stroke="#aab7bb" strokeWidth="2" strokeLinecap="round" />
      <circle cx="246" cy="125" r="4" fill="#10b8a8" />
      <path d="M62 47h137" stroke="#c0cbcf" strokeWidth="3" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

export default function MachineFleet() {
  const [machines, setMachines] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [isAddingMachine, setIsAddingMachine] = useState(false);

  async function carregarDados() {
    setLoading(true);
    try {
      const [resMaquinas, resUsuarios] = await Promise.all([
        fetchComAuth("/api/maquinas?limite=100"),
        fetchComAuth("/usuarios/listar?limite=100"),
      ]);

      const dadosMaquinas = await resMaquinas.json();
      const dadosUsuarios = await resUsuarios.json();

      const listaUsuarios = dadosUsuarios.dados || [];
      setEmployees(listaUsuarios);

      const listaMaquinas = (dadosMaquinas.dados || []).map((m) => {
        const { category: cat, image, type } = inferCategoryAndImage(m.nome);
        return {
          id: m.id,
          name: m.nome,
          type: type,
          category: cat,
          status: m.estado || "Disponível",
          progress: m.estado === "Em Operação" ? 75 : m.estado === "Em Manutenção" ? 25 : 0,
          operator: m.operador_nome || "",
          operatorId: m.usuario_id || null,
          shift: m.operador_turno || "—",
          order: m.estado === "Em Operação" ? `OP-${1000 + Number(m.id)}` : "Aguardando programação",
          image: image,
        };
      });

      setMachines(listaMaquinas);
    } catch (err) {
      console.error("Erro ao carregar máquinas e usuários:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const visibleMachines = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return machines.filter((machine) => {
      const matchesQuery = `${machine.name} ${machine.type} ${machine.operator}`
        .toLowerCase()
        .includes(normalizedQuery);
      return matchesQuery && (category === "Todas" || machine.category === category);
    });
  }, [category, machines, query]);

  function updateMachine(machineId, updates) {
    setMachines((currentMachines) =>
      currentMachines.map((machine) =>
        machine.id === machineId ? { ...machine, ...updates } : machine,
      ),
    );
  }

  async function assignEmployee(machine, employeeId) {
    const employee = employees.find((item) => String(item.id) === String(employeeId));
    const novoEstado = employee ? "Em Operação" : "Disponível";

    // 1. Atualização otimista na interface
    updateMachine(machine.id, {
      operator: employee?.nome ?? "",
      operatorId: employee?.id ?? null,
      shift: employee?.turno ?? "—",
      status: novoEstado,
      order: employee ? `OP-${1000 + Number(machine.id)}` : "Aguardando programação",
      progress: employee ? 60 : 0,
    });

    // 2. Persistência real no MySQL via API
    try {
      await fetchComAuth(`/api/maquinas/${machine.id}`, {
        method: "PUT",
        body: JSON.stringify({
          nome: machine.name,
          estado: novoEstado,
          usuario_id: employee ? employee.id : null,
        }),
      });
    } catch (err) {
      console.error("Erro ao persistir atribuição no banco:", err);
    }
  }

  async function addMachine(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nome = formData.get("name").trim();

    try {
      const res = await fetchComAuth("/api/maquinas", {
        method: "POST",
        body: JSON.stringify({
          nome,
          estado: "Disponível",
        }),
      });

      if (res.ok) {
        await carregarDados();
      }
    } catch (err) {
      console.error("Erro ao cadastrar máquina no banco:", err);
    }

    setCategory("Todas");
    setQuery("");
    setIsAddingMachine(false);
  }

  return (
    <section className="machine-fleet" aria-labelledby="machine-fleet-title">
      <div className="machine-fleet-toolbar">
        <div>
          <h2 id="machine-fleet-title">Máquinas e ocupação</h2>
          <p>Visualize equipamentos, operadores e progresso das ordens.</p>
        </div>
        <div className="machine-fleet-actions">
          <div className="machine-fleet-filters">
            <label className="machine-search">
              <Search size={15} aria-hidden="true" />
              <span className="sr-only">Buscar máquina</span>
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar máquina"
                type="search"
                value={query}
              />
            </label>
            <label className="sr-only" htmlFor="machine-category">Filtrar por categoria</label>
            <select
              id="machine-category"
              onChange={(event) => setCategory(event.target.value)}
              value={category}
            >
              <option>Todas</option>
              <option>Usinagem</option>
              <option>Corte</option>
            </select>
          </div>
          <button
            aria-expanded={isAddingMachine}
            className="button button-primary machine-add-button"
            onClick={() => setIsAddingMachine((isOpen) => !isOpen)}
            type="button"
          >
            {isAddingMachine ? <X size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
            {isAddingMachine ? "Cancelar" : "Adicionar máquina"}
          </button>
        </div>
      </div>

      {isAddingMachine && (
        <form className="panel machine-create-form" onSubmit={addMachine}>
          <div className="machine-create-heading">
            <div>
              <h3>Adicionar máquina</h3>
              <p>Cadastre o equipamento para acompanhar sua operação.</p>
            </div>
          </div>
          <div className="machine-create-fields">
            <label>
              Identificação
              <input
                autoFocus
                maxLength={30}
                name="name"
                placeholder="Ex.: CNC-04"
                required
              />
            </label>
            <label>
              Tipo de máquina
              <input
                maxLength={80}
                name="type"
                placeholder="Ex.: Centro de usinagem CNC"
                required
              />
            </label>
            <label>
              Categoria
              <select defaultValue="Usinagem" name="category">
                <option>Usinagem</option>
                <option>Corte</option>
              </select>
            </label>
            <button className="button button-primary" type="submit">
              Salvar máquina
            </button>
          </div>
        </form>
      )}

      <div className="machine-fleet-grid">
        {visibleMachines.map((machine) => (
          <article className="machine-detail-card" key={machine.id}>
            <div className="machine-visual">
              <MachineIllustration variant={machine.image} />
              <span className={`machine-status machine-status-${getStatusClass(machine.status)}`}>
                <span />
                {machine.status}
              </span>
              <span className="machine-category">{machine.category}</span>
            </div>
            <div className="machine-card-content">
              <div className="machine-card-heading">
                <div>
                  <h3>{machine.name}</h3>
                  <p>{machine.type}</p>
                </div>
                <span className="machine-type-icon"><Factory size={17} aria-hidden="true" /></span>
              </div>

              <div className="machine-order">
                <span>Ordem de produção</span>
                <strong>{machine.order}</strong>
              </div>

              <div className="machine-progress">
                <div>
                  <span>Progresso da ordem</span>
                  <strong>{machine.progress}%</strong>
                </div>
                <div
                  aria-label={`Progresso: ${machine.progress}%`}
                  className="machine-progress-track"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={machine.progress}
                >
                  <span style={{ width: `${machine.progress}%` }} />
                </div>
                <label>
                  <span className="sr-only">Atualizar progresso de {machine.name}</span>
                  <input
                    max="100"
                    min="0"
                    onChange={(event) =>
                      updateMachine(machine.id, { progress: Number(event.target.value) })
                    }
                    type="range"
                    value={machine.progress}
                  />
                </label>
              </div>

              <div className="machine-assignment">
                <label htmlFor={`operator-${machine.id}`}>Funcionário responsável</label>
                <select
                  id={`operator-${machine.id}`}
                  onChange={(event) => assignEmployee(machine, event.target.value)}
                  value={machine.operatorId || ""}
                >
                  <option value="">Sem operador atribuído</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.nome} · {employee.turno || "Geral"}
                    </option>
                  ))}
                </select>
                <p>
                  <Wrench size={13} aria-hidden="true" />
                  Turno: {machine.shift}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
      {visibleMachines.length === 0 && (
        <p className="employee-empty">Nenhuma máquina encontrada para esse filtro.</p>
      )}
    </section>
  );
}
