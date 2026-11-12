"use client";
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'

export default function EmployeeForm() {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [cargo, setCargo] = useState("");
  const [cpf, setCPF] = useState("");
  const [turno, setTurno] = useState("");
  const [perfil, setPerfil] = useState("");

  function alternarVisibilidadeSenha() {
    setSenhaVisivel(!senhaVisivel);
  }

  function lerSenha(e) {
    setSenha(e.target.value);
  }

  function onClickCriar(e) {
    e.preventDefault();
    try {
      criarUser()
    } catch (e) {
      console.error("Erro ao criar o funcionário");
    }
  }

  async function criarUser() {
    fetch("http://localhost:8080/usuarios/cadastro/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        email,
        senha,
        cargo,
        cpf,
        turno,
        perfil
      })
    })
    setNome("");
    setEmail("");
    setSenha("");
    setCargo("");
    setCPF("");
    setTurno("");
    setPerfil("");
    alert("Sucesso")
  }
  return (
    <section className="panel employee-form-panel" aria-labelledby="employee-form-title">
      <div className="panel-heading">
        <div>
          <h2 id="employee-form-title">Novo funcionário</h2>
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
            placeholder="Ex.: Inspeção da Prensa Hidráulica"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>
        <label>
          Descrição
          <textarea
            autoComplete="email"
            maxLength={300}
            name="email"
            placeholder="Checagem de vazamento no pistão de 200 toneladas e análise química do óleo mineral."
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          <div className="d-flex align-itmes-center justify-content-center gap-3 w-full">
            <div className='w-full col-6 ps-2'>
              Começo do prazo
              <input
                name="role"
                placeholder="Ex.: Operador de máquinas"
                minLength={3}
                maxLength={80}
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                required
              />
            </div>
            <div className='w-full col-6 pe-2'>
              Prazo Final
              <input
                name="cpf"
                placeholder="CPF do usuário"
                minLength={14}
                maxLength={14}
                value={cpf}
                onChange={(e) => setCPF(e.target.value)}
                required
              />
            </div>
          </div>
        </label>
        <label>
          <div className="d-flex align-itmes-center justify-content-center gap-3 w-full ">
            <div className='w-full col-6 ps-2'>
              Prioridade
              <select name="shift" className="form-select w-100" value={turno} onChange={(e) => setTurno(e.target.value)} required>
                <option disabled value="">Selecione um turno</option>
                <option value="Manhã">Baixa</option>
                <option value="Tarde">Média</option>
                <option value="Noite">Alta</option>
              </select>
            </div>
            <div className='w-full col-6 pe-2'>
              Setor
              <select name="shift" className="form-select w-100" value={perfil} onChange={(e) => setPerfil(e.target.value)} required>
                <option disabled value="">Selecione um perfil</option>
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
          Cadastrar funcionário
        </button>
      </form>
    </section>
  );
}
