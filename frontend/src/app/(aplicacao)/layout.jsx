import "../globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@/components/Sidebar/sidebar.css";
import Sidebar from "@/components/Sidebar";
import ClientBootstrap from "@/components/ClientBootstrap";

export const metadata = {
  title: "Factory Flow",
  description: "Uma aplicação Tech System para gerenciar a sua empresa",
};

export default function AplicacaoLayout({ children }) {
  return (
    <div className="d-flex flex-grow-1 vh-100 app-layout">
      {children}
    </div>
  );
}