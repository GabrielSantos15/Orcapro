"use client";

import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import Input from "../forms/Input";
import { Investimento } from "@/interfaces/Investimento";
import { RefreshCw } from "lucide-react";

interface FormAtualizarSaldoProps {
  investimento: Investimento;
}

export default function FormAtualizarSaldoInvestidoModal({
  investimento,
}: FormAtualizarSaldoProps) {
  const { closeModal, triggerUpdate } = useModalStore();

  const [novoSaldo, setNovoSaldo] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const token = localStorage.getItem("user_token");
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");

      const valorFormatado = parseFloat(novoSaldo);
      if (isNaN(valorFormatado) || valorFormatado < 0) {
        throw new Error("Informe um saldo válido. Não pode ser negativo.");
      }

      const response = await fetch(
        `/api/investimento/${investimento.id}/saldo`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ novoSaldo: valorFormatado }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao atualizar o saldo.");
      }

      alert("Saldo sincronizado com sucesso!");
      triggerUpdate();
      closeModal();
    } catch (err: any) {
      setErro(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <RefreshCw className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Sincronizar Rendimento
        </h2>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Atualize o valor exato deste investimento baseado nos rendimentos da
        corretora.
        <br />
        <span className="font-semibold text-gray-700">
          Isso não altera o saldo da sua conta bancária.
        </span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {erro && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200 font-medium">
            {erro}
          </div>
        )}

        {/* RESUMO DO VALOR ANTIGO */}
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600 mb-3">
            Saldo Atual Registrado:{" "}
            <span className="font-bold text-gray-900">
              R$ {(investimento.valorInvestido || 0).toFixed(2)}
            </span>
          </p>
        </div>

        {/* INPUT DE NOVO SALDO */}
        <Input
          label="Qual o novo saldo total hoje? (R$)"
          type="number"
          value={novoSaldo}
          onChange={(e) => setNovoSaldo(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min={0}
          required
          autoFocus
        />

        {/* BOTÕES */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={carregando}
            className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={carregando || novoSaldo === ""}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {carregando ? "Salvando..." : "Salvar Novo Saldo"}
          </button>
        </div>
      </form>
    </div>
  );
}
