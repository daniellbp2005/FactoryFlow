import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ClientBootstrap from "@/components/ClientBootstrap";

export const metadata = {
  title: "Factory Flow",
  description: "Uma aplicação Tech System para gerenciar a sua empresa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <ClientBootstrap />
      <body className="flex bg-cinza">
        {children}</body>
    </html>
  );
}
