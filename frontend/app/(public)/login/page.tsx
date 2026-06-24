"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Input from "@/components/forms/Input";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao fazer login");
        setError(data.error || "Erro ao fazer cadastro");
        return;
      }

      toast.success("Login realizado com sucesso!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error(message);
      // setErroMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-lg p-8 m-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-[var(--primary-color)]">Orça</span>
            <span className="text-[var(--primary-color)] opacity-75">Pro</span>
          </h1>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
          Login
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <Input
              id="email"
              type="email"
              label="Usuário"
              placeholder="Digite seu usuário"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <Input
              id="senha"
              type="password"
              label="Senha"
              placeholder="Digite suas senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/recuperar"
              className="text-sm text-[var(--primary-color)] hover:text-[var(--primary-hover)] font-medium transition-colors"
            >
              Esqueceu a senha? <span className="font-semibold">Recuperar</span>
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] disabled:opacity-50 text-white font-bold rounded-lg transition duration-200 ease-in-out cursor-pointer"
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-[var(--border-color)]"></div>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-[var(--text-secondary)]">
            Não possui conta?{" "}
          </span>
          <Link
            href="/cadastro"
            className="text-[var(--primary-color)] hover:text-[var(--primary-hover)] font-semibold transition-colors"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}
