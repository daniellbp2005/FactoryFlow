import "../globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@/components/Sidebar/sidebar.css";
import Sidebar from "@/components/Sidebar";
import ClientBootstrap from "@/components/ClientBootstrap";

export const metadata = {
    title: "Projeto Base",
    description: "Template base com Next.js, Express e MySQL",
};

export default function AplicacaoLayout({ children }) {
  return (
    <div className="d-flex flex-grow-1 vh-100 app-layout">
      <Sidebar />
      {children}
    </div>
  );
}