"use client"
import '../user.css';
import Header from "@/components/Header";
import SidebarUser from "@/components/Sidebar-user";
import PageHeading from '@/components/PageHeading';
import UserReports from '@/components/UserReports';
import { useState, useEffect } from "react";
import Footer from '@/components/Footer';

export default function Relatorios() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem("factoryflow_usuario"));
        setUsuario(usuarioLogado);
    }, []);
    return (
        <main className='user-page'>
            <SidebarUser />
            <Header usuario={usuario?.nome ?? "Usuário não logado"} />
            <section className="user-content">
                <PageHeading
                    eyebrow="FACTORYFLOW / REGISTROS"
                    title="Relatórios"
                    description="Acompanhe os relatórios e comentários registrados para os operadores."
                />

                <UserReports />
                <Footer />
            </section>
        </main>
    )
}