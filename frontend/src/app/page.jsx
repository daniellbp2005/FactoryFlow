'use client';
import styles from "./page.module.css";
import { AtSign, LockKeyhole, Eye, EyeOff, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"

export default function Login() {
  // Aqui a baixo jápega os dados do inputs, tanto do Login e Cadastro. Falta só jogar em lista e subir no banco

  const [perfil, setPerfil] = useState("usuario");
  const [dado, setDado] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [msgErro, setErro] = useState("");
  const router = useRouter();

  function lerEmail(e) {
    setEmail(e.target.value);
  }
  function lerSenha(e) {
    setSenha(e.target.value);
  }
  function alternarVisibilidadeSenha() {
    setSenhaVisivel(!senhaVisivel);
  }

  function entrarLogin(e) {
    e.preventDefault();

    if (!email || !senha) {
      setErro("Campos Inválidos");
      return;
    }

    const dados = { email, senha };



    useEffect(() => {

    }
    )
  }

  async function loadPerfil(e) {
    e.preventDefault();
    try {
      const LinkAPI = await fetch(`http://localhost:8080/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          senha
        })
      });

      const resultado = await LinkAPI.json();
      console.log(resultado);

      if (!resultado.ok) {
        setErro("Erro no login")
      }
      const usuario = resultado.dados.usuario

      if (usuario.perfil === "administrador") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
      setDado();
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  }


  return (
    <>
      <main className={styles.main}>
        <div className={styles.loginDiv}>
          <div className={styles.textDiv}>
            <div className={styles.containerTitle}>
              <img src="./images/logotype/logotype.png" />
              <div className={styles.textTitle}>
                <h1><b>FactoryFlow</b></h1>
                <p>Uma aplicação Tech System</p>
              </div>
            </div>
            <div className={styles.containerText}>
              <h2>Gerenciamento inteligente de <b>processos e máquinas</b></h2>
              <h3>Mais eficiência, controle e produtividade para a sua indústria.</h3>
            </div>
          </div>
          <div className={styles.containerLogin}>
            <div className={styles.contentHeader}>
              <img src="./images/logotype/logotype-branco.png" />
              <h1 className={styles.titulo}>
                <span>Bem vindo!</span>
              </h1>
            </div>
            <div className={styles.bodyLogin}>
              <form onSubmit={entrarLogin}>
                <label className="label" htmlFor="email">E-mail</label>
                <div className={styles.inputContent}>
                  <AtSign size={19} />
                  <input className={styles.input} type="email" name="email" id="email" placeholder="SuaConta@email.com"
                    required
                    minLength={8}
                    maxLength={50}
                    value={email}
                    onChange={lerEmail} />
                </div>
                <label className="label" htmlFor="senha">Senha</label>
                <div className={styles.inputContent}>
                  <LockKeyhole size={19} />
                  <input className={styles.input} type={senhaVisivel ? "text" : "password"} name="senha" id="senha" placeholder="Digite aqui" required
                    minLength={3}
                    maxLength={24}
                    value={senha}
                    onChange={lerSenha}
                  />
                  <button
                    type="button"
                    onClick={alternarVisibilidadeSenha}
                    className={styles.togglePassword}
                  >
                    {senhaVisivel ? <Eye size={19} /> : <EyeOff size={19} />}
                  </button>
                </div>
                <div className={styles.rowBtn}>
                  <button
                    className={styles.btnL}
                    onClick={loadPerfil}
                  >Entrar</button>
                </div>
              </form>
              {msgErro != "" && <p>{msgErro}</p>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
