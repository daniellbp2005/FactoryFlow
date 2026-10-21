import "./globals.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import ClientBootstrap from "@/components/ClientBootstrap";

export const metadata = {
  title: "Projeto Base",
  description: "Template base com Next.js, Express e MySQL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <ClientBootstrap />
      <body>{children}</body>
    </html>
  );
}
