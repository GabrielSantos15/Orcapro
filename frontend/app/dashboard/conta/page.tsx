'use client'

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import Input from "@/components/forms/Input";
import { useUsuario } from "@/hooks/useUsuario";
import { toast } from "sonner";
import { TfiReload } from "react-icons/tfi";

export default function Perfil() {
    const { user } = useAuth();
    const { atualizarUsuario, atualizarSenha, avatarUrl, novoAvatar } = useUsuario()

    const [nome, setNome] = useState(user?.nome || "");
    const [email, setEmail] = useState(user?.email || "");
    const [editando, setEditando] = useState(false);

    // senha
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    useEffect(() => {
        if (user) {
            setNome(user.nome);
            setEmail(user.email);
        }
    }, [user]);

    function handleRandomAvatar() {
        novoAvatar();
    }

    async function handleSaveProfile() {
        try {
            await atualizarUsuario({ nome, email });
            toast.success("Perfil atualizado com sucesso!");
            setEditando(false);
        } catch (err: any) {
            toast.error(err.message || "Erro ao atualizar perfil");
        }
    }

    async function handleChangePassword() {
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            toast.error("Preencha todos os campos de senha");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            toast.error("As senhas não coincidem");
            return;
        }

        try {
            await atualizarSenha({ senhaAtual, novaSenha });

            toast.success("Senha alterada com sucesso!");

            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");

        } catch (err: any) {
            toast.error(err.message || "Erro ao atualizar a senha");
        }
    }

    return (
        <main>
            <HeaderDashboard title="Perfil" subTitle="Gerencie suas informações" />

            {/* HEADER */}
            <div className="flex items-center bg-[var(--bg-surface)] rounded-2xl gap-6 border-b border-[var(--border-color)] p-4">
                <div className="flex flex-col items-center gap-2">
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-20 h-20 rounded-[var(--radius-full)] border border-[var(--border-color)] bg-[var(--bg-primary)] object-cover"
                    />
                    <button
                        onClick={handleRandomAvatar}
                        className="flex items-center gap-2 text-xs px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-[var(--radius-sm)] hover:brightness-95 transition-all"
                    >
                        <TfiReload/> Trocar foto
                    </button>
                </div>

                <div>
                    <h2 className="text-xl lg:text-2xl font-semibold text-[var(--text-primary)]">{user?.nome}</h2>
                    <p className="text-sm lg:text-base text-[var(--text-muted)]">{user?.email}</p>
                </div>
            </div>

            <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 mt-3 gap-3">

                {/* PERFIL */}
                <WidgetContainer titulo="Informações pessoais">
                    <div className="flex flex-col justify-between h-full p-5">
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Nome Completo"
                                value={nome}
                                disabled={!editando}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Seu nome"
                            />
                            <Input
                                label="E-mail"
                                value={email}
                                disabled={!editando}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-6 mt-auto">
                            {!editando ? (
                                <button
                                    onClick={() => setEditando(true)}
                                    className="px-4 py-2 bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white rounded-[var(--radius-md)] transition-colors font-medium"
                                >
                                    Editar perfil
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            setNome(user?.nome || "");
                                            setEmail(user?.email || "");
                                            setEditando(false);
                                        }}
                                        className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:brightness-95 rounded-[var(--radius-md)] transition-colors font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="px-4 py-2 bg-[var(--success-color)] hover:bg-[var(--primary-hover)] text-white rounded-[var(--radius-md)] transition-colors font-medium"
                                    >
                                        Salvar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </WidgetContainer>

                {/* SENHA */}
                <WidgetContainer titulo="Segurança">
                    <div className="flex flex-col justify-between h-full p-5">
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Senha Atual"
                                type="password"
                                value={senhaAtual}
                                onChange={(e) => setSenhaAtual(e.target.value)}
                                placeholder="Sua senha atual"
                            />
                            <Input
                                label="Nova Senha"
                                type="password"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                placeholder="Nova senha"
                            />
                            <Input
                                label="Confirmar Nova Senha"
                                type="password"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                placeholder="Confirme a nova senha"
                            />
                        </div>

                        <div className="flex justify-end pt-6 mt-auto">
                            <button
                                onClick={handleChangePassword}
                                className="px-4 py-2 bg-[var(--danger-color)] hover:brightness-90 text-white rounded-[var(--radius-md)] transition-colors font-medium"
                            >
                                Alterar senha
                            </button>
                        </div>
                    </div>
                </WidgetContainer>

            </div>
        </main>
    );
}