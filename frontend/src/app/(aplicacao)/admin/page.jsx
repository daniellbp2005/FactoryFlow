import "./admin.css"
import { Globe } from "lucide-react"

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  return (
    <main>
      <div className="topbar">
        <div className="caixa-cargo">Gerente</div>
        <p>Visão Geral</p>
      </div>

      <div className="container-text-top ">
        
        <div className="container-text">
          <p className="text-azul">FACTORYFLOW / MÊS</p>
          <h1 className="text-light">Planejamento de produção</h1>
          <p className="text-cinza">Programação, equipamentos e produtividade em uma única visão</p>
        </div>

        <div className="container-cal-calen">
          <button type="button"></button>
          <button type="button"></button>
        </div>

      </div>

      <div className="conteudo-all">
        <div className="conteudo-base"></div>
        <div className="conteudo-base"></div>
        <div className="conteudo-base"></div>
        <div className="conteudo-base"></div>
      </div>

      <div className="container-producao">
        <div className="producao-cima">

          <div className="text-producao">
            <h2>Programação da produção</h2>
            <p>Tarefas e ordens de serviços</p>
          </div>

          <div className="btn-conjunto">
            <button className="btn-active" type="button">Dia</button>
            <button className="btn-inative" type="button">Semana</button>
            <button className="btn-inative-p" type="button">Mês</button>
          </div>

        </div>

      </div>


    </main>
  );
}

