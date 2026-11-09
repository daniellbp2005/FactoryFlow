"use client";
import Link from "next/link";
import styles from "./not-found.module.css";
export default function NotFound() {
  return (
    <main className={styles.background}>
      <div className={styles.textDiv}>
        <h1>Erro 404</h1>
        <h3>Página não encontrada</h3>
        <p>Você tentou acessar uma página que não existe.</p>
        <Link href="/" className={styles.returnButton}>Voltar para a página inicial</Link>
      </div>
      <div className={styles.containerTitle}>
          <img src="./images/logotype/logotype.png"/>
          <div className={styles.textTitle}>
            <h1><b>FactoryFlow</b></h1>
        </div>
      </div>
    </main>
  );
}