import "../globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "@/components/Sidebar";
import ClientBootstrap from "@/components/ClientBootstrap";

export const metadata = {
    title: "Projeto Base",
    description: "Template base com Next.js, Express e MySQL",
};

export default function AplicacaoLayout({ children }) {
  return (
    <div className="d-flex flex-grow-1 w-100 bg-cinza">
      <Sidebar />
      {children}
    </div>
  );
}