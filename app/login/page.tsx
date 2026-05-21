"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/forms/Input";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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
        setError(data.error || "Erro ao fazer login");
        return;
      }

      setSuccess("Login realizado com sucesso!");

      // Guardar dados do usuário
      localStorage.setItem("user_token", data.token);

      // Redirecionar
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-purple-600">Orça</span>
            <span className="text-purple-400">Pro</span>
          </h1>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
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
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Esqueceu a senha? <span className="font-semibold">Recuperar</span>
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition duration-200 ease-in-out"
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-gray-600">Não possui conta? </span>
          <Link
            href="/cadastro"
            className="text-blue-500 hover:text-blue-600 font-semibold"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
