"use client"
import '../user.css';
import Header from "@/components/Header";
import SidebarUser from "@/components/Sidebar-user";
import PageHeading from '@/components/PageHeading';
import MachineUserView from '@/components/MachineUserView';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { fetchComAuth } from '@/utils/api';

export default function Maquinas() {
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
                    eyebrow="FACTORYFLOW / OPERAÇÃO"
                    title="Máquinas"
                    description="Acompanhe a disponibilidade e o estado dos equipamentos."
                />

                <MachineUserView />
                <Footer />
            </section>
        </main>
    );
}