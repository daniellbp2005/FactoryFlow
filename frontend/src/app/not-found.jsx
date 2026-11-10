"use client";
import Link from "next/link";
import styles from "./not-found.module.css";
export default function NotFound() {
  return (
<div className={styles['error-container']}>

      <div className={styles['text-section']}>
        <img src="../../images/logotype/logotype.png" alt="" width={80} height={80} />
        <h2 className={styles['title-primary']}>Opss!</h2>
        <h3 className={styles['title-secondary']}>Você entrou em uma página que não existe !</h3>
        <p className={styles['description']}>
          Eu sugiro que volte a página de login ! 
        </p>
        <a href="/" className={styles['btn-home']}>Clique aqui para voltar.</a>
      </div>

      {/* Seção Direita: Ilustração */}
      <div className={styles['image-section']}>
        <img
          src="../../images/404.png"
          alt="404 background"
          className={styles['bg-image']}
        />
        <img
          src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/404/error-6.png"
          alt="404 illustration"
          className={styles['hero-image']}
        />
      </div>
    </div>
  );
}