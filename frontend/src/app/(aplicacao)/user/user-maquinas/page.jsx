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
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [usuario,setUsuario] = useState(null);

    useEffect(() => {
        async function listarMaquinas() {
            try {
                setLoading(true);
                setError("");

                const resposta = await fetchComAuth("/api/maquinas?pagina=1&limite=100");
                const data = await resposta.json();

                if (!resposta.ok) {
                    throw new Error(data.erro || "Não foi possível carregar as máquinas.");
                }

                setMachines(data.dados || []);
            } catch (erro) {
                console.error("Erro ao consultar máquinas", erro);
                setError("Não foi possível carregar as máquinas cadastradas.");
            } finally {
                setLoading(false);
            }
        }

        const usuarioLogado = JSON.parse(localStorage.getItem("factoryflow_usuario"));
        setUsuario(usuarioLogado);

        listarMaquinas();
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

                <MachineUserView machines={machines} loading={loading} error={error} />
                <Footer />
            </section>
        </main>
    )
}