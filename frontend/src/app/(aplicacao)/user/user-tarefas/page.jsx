"use client"
import '../user.css';
import Header from "@/components/Header";
import SidebarUser from "@/components/Sidebar-user";
import PageHeading from '@/components/PageHeading';
import Footer from '@/components/Footer';
import { useState, useEffect } from "react";

export default function Tarefas(){
    const [usuario,setUsuario] = useState(null);
        
          useEffect(() => {
            const usuarioLogado = JSON.parse(localStorage.getItem("factoryflow_usuario"));
            setUsuario(usuarioLogado);
          }, []);
    return(
        <main className='user-page'>
            <SidebarUser />
            <Header usuario={usuario?.nome ?? "Usuário não logado"} />
            <section className="user-content">
                <PageHeading
                    eyebrow="FACTORYFLOW / TAREFAS"
                    title="Planejamento de Produção"
                    description="Organize as tarefas e acompanhe a disponibilidade dos equipamentos."
                />

                <Footer />
            </section>
        </main>
    )
}