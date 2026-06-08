"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/forms/Input";

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validar se as senhas 
    if (senha !== confirmaSenha) {
      setError("As senhas não conferem!");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: `${nome} ${sobrenome}`, email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao fazer cadastro");
        return;
      }

      setSuccess("Cadastro realizado com sucesso!");

      // Guardar token do usuário
      localStorage.setItem("user_token", data.token || "true");

      // Redirecionar
      setTimeout(() => {
        router.push("/login");
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cadastro</h2>

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
          {/* Nome Input */}
          <div>
            <Input
              id="nome"
              type="text"
              label="Nome"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          {/* Sobrenome Input */}
          <div>
            <Input
              id="sobrenome"
              type="text"
              label="Sobrenome"
              placeholder="Digite seu sobrenome"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Digite seu email"
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
              placeholder="Digite uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <Input
              id="confirmaSenha"
              type="password"
              label="Confirmar Senha"
              placeholder="Confirme sua senha"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition duration-200 ease-in-out"
          >
            {loading ? "Carregando..." : "Cadastrar"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Sign In Link */}
        <div className="text-center">
          <span className="text-gray-600">Já possui conta? </span>
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-600 font-semibold"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
