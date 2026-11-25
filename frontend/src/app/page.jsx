'use client';
import styles from "./page.module.css";
import Image from "next/image";
import {
  ArrowRight,
  ChartNoAxesCombined,
  Eye,
  EyeOff,
  LockKeyhole,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, setSessao } from "@/utils/api";

export default function Login() {
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

  async function entrarLogin(e) {
    e.preventDefault();

    if (!email || !senha) {
      setErro("Campos Inválidos");
      return;
    }

    try {
      const LinkAPI = await fetch(`${API_BASE_URL}/usuarios/login`, {
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

      if (!resultado.sucesso) {
        setErro(resultado.erro || "Erro no login");
        return;
      }

      const { token, usuario } = resultado.dados;
      setSessao(token, usuario);

      if (usuario?.perfil === "administrador") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  }

  return (
    <main className={styles.main}>
      <section className={styles.visualPanel} aria-label="FactoryFlow para a indústria">
        <div className={styles.brandLockup}>
          <Image src="/images/logotype/logotype.png" alt="" width={108} height={108} />
          <p>Factory <span>Flow</span></p>
        </div>

        <div className={styles.pitch}>
          <span className={styles.accentRule} />
          <h2>Controle, otimize e maximize sua <span>produção.</span></h2>
          <p>Gerencie máquinas, acompanhe processos e tenha total visibilidade da sua operação.</p>
        </div>

        <ul className={styles.features} aria-label="Recursos da plataforma">
          <li>
            <span className={styles.featureIcon}><ChartNoAxesCombined size={22} /></span>
            <span>Indicadores<br />em tempo real</span>
          </li>
          <li>
            <span className={styles.featureIcon}><Settings size={22} /></span>
            <span>Gestão de<br />máquinas</span>
          </li>
          <li>
            <span className={styles.featureIcon}><ShieldCheck size={22} /></span>
            <span>Controle de<br />processos</span>
          </li>
        </ul>
      </section>

      <section className={styles.loginPanel} aria-labelledby="login-title">
        <div className={styles.loginCard}>
          <header className={styles.contentHeader}>
            <Image src="/images/logotype/logotype.png" alt="" width={88} height={88} />
            <p className={styles.cardBrand}>Factory <span>Flow</span></p>
            <h1 id="login-title">Bem-vindo de volta!</h1>
            <p className={styles.loginIntro}>Faça login para acessar o sistema.</p>
          </header>

          <form className={styles.loginForm} onSubmit={entrarLogin}>
            <label className={styles.srOnly} htmlFor="email">E-mail</label>
            <div className={styles.inputContent}>
              <UserRound size={21} aria-hidden="true" />
              <input
                className={styles.input}
                type="email"
                name="email"
                id="email"
                placeholder="Usuário ou E-mail"
                autoComplete="username"
                required
                minLength={8}
                maxLength={50}
                value={email}
                onChange={lerEmail}
              />
            </div>

            <label className={styles.srOnly} htmlFor="senha">Senha</label>
            <div className={styles.inputContent}>
              <LockKeyhole size={21} aria-hidden="true" />
              <input
                className={styles.input}
                type={senhaVisivel ? "text" : "password"}
                name="senha"
                id="senha"
                placeholder="Senha"
                autoComplete="current-password"
                required
                minLength={3}
                maxLength={24}
                value={senha}
                onChange={lerSenha}
              />
              <button
                type="button"
                onClick={alternarVisibilidadeSenha}
                className={styles.togglePassword}
                aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
              >
                {senhaVisivel ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            <button className={styles.btnL} type="submit">
              Entrar <ArrowRight size={20} aria-hidden="true" />
            </button>
            {msgErro && <p className={styles.errorMessage} role="alert">{msgErro}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}