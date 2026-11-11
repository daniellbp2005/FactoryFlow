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
          Nome completo
          <input
            autoComplete="name"
            maxLength={100}
            name="name"
            placeholder="Ex.: Ana Costa"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>
        <label>
          E-mail
          <input
            autoComplete="email"
            maxLength={150}
            name="email"
            placeholder="nome@empresa.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Senha
          <div className="d-flex align-itmes-center justify-content-center gap-2">
            <input
              autoComplete="senha"
              name="senha"
              placeholder="Digite a senha do usuário"
              type={senhaVisivel ? "text" : "password"}
              minLength={3}
              maxLength={24}
              value={senha}
              onChange = {(e) => {
                setSenha(e.target.value)
                lerSenha
              }}
              required
            />
            <button
              type="button"
              onClick={alternarVisibilidadeSenha}
              className="button button-primary w-25"
            >
              {senhaVisivel ? <Eye size={19} /> : <EyeOff size={19} />}
            </button>
          </div>
        </label>
        <label>
          <div className="d-flex align-itmes-center justify-content-center gap-3 w-full">
            <div className='w-full col-6 ps-2'>
              Cargo
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
              CPF
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
              Turno
              <select name="shift" className="form-select w-100" value={turno} onChange={(e) => setTurno(e.target.value)} required>
                <option disabled value="">Selecione um turno</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
                <option value="Administrativo">Administrativo</option>
              </select>
            </div>
            <div className='w-full col-6 pe-2'>
              Perfil
              <select name="shift" className="form-select w-100" value={perfil} onChange={(e) => setPerfil(e.target.value)} required>
                <option disabled value="">Selecione um perfil</option>
                <option value="funcionario">Funcionário</option>
                <option value="administrador">Administrador</option>
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
