import { useAuth } from "@/app/context/AuthContext";
import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect, use } from "react";

const AVATAR_SEED_KEY = "avatar_seed";
const AVATAR_BASE_URL = "https://api.dicebear.com/9.x/bottts-neutral/svg";

export function useUsuario() {
  const { user, setUser } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const { triggerUpdate } = useModalStore();

  // ======================================================
  // AVATAR
  // ======================================================

const avatarUrl = `${AVATAR_BASE_URL}?seed=${encodeURIComponent(user?.avatarSeed || "usuario")}`;

  const novoAvatar = () => {
    const seed = Math.random().toString(36).substring(2, 10);
    localStorage.setItem(AVATAR_SEED_KEY, seed);
    if (user) {
      setUser({ ...user, avatarSeed: seed });
    }
  };

  // ======================================================
  // USUÁRIO
  // ======================================================

  const atualizarUsuario = async (formData: {
    nome: string;
    email: string;
  }) => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await fetch(`/api/usuario`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao atualizar usuário");
      }

      const usuarioAtualizado = await response.json();
      setUser(usuarioAtualizado);

      triggerUpdate();
      return true;
    } catch (err: any) {
      setErro(err.message || "Erro ao conectar com o servidor");
      throw new Error(err.message || "Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  };

  const atualizarSenha = async (formData: {
    senhaAtual: string;
    novaSenha: string;
  }) => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await fetch(`/api/usuario/senha`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao atualizar senha");
      }

      triggerUpdate();
      return true;
    } catch (err: any) {
      setErro(err.message || "Erro ao conectar com o servidor");
      throw new Error(err.message || "Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  };

  return {
    carregando,
    erro,
    atualizarUsuario,
    atualizarSenha,
    avatarUrl,
    novoAvatar,
  };
}
