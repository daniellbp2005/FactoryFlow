import "./admin.css"
import {Globe} from "lucide-react"

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  return (
    <main>
        <div className="topbar">
          <div className="caixa-cargo">Gerente</div>
        </div>

        <div className="conteudo-all">
          <div className="conteudo-base"></div>
          <div className="conteudo-base"></div>
          <div className="conteudo-base"></div>
          <div className="conteudo-base"></div>
        </div>


    </main>
  );
}

