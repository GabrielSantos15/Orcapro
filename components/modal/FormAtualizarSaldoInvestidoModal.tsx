"use client";

import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import Input from "../forms/Input"; // Ajuste o caminho conforme o seu projeto
import { Investimento } from "@/interfaces/Investimento"; 
import { RefreshCw } from "lucide-react";

interface FormAtualizarSaldoProps {
  investimento: Investimento;
}

export default function FormAtualizarSaldoInvestidoModal({ 
  investimento 
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

      // Rota do BFF apontando para o PATCH
      const response = await fetch(`/api/investimento/${investimento.id}/saldo`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ novoSaldo: valorFormatado }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao atualizar o saldo.");
      }

      alert("Saldo sincronizado com sucesso!");
      triggerUpdate(); // Atualiza a tela de investimentos do usuário
      closeModal(); // Fecha o modal
    } catch (err: any) {
      setErro(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <RefreshCw className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Sincronizar Rendimento
        </h2>
      </div>
      
      <p className="text-sm text-gray-500 mb-4 mt-1">
        Atualize o valor exato deste investimento baseado nos rendimentos da corretora. 
        <strong> Isso não altera o saldo da sua conta bancária.</strong>
      </p>
      <hr className="mb-4" />

      <form onSubmit={handleSubmit} className="space-y-4">
        {erro && (
          <div className="p-3 bg-red-50 text-red-600 rounded text-sm border border-red-200">
            {erro}
          </div>
        )}

        {/* RESUMO DO VALOR ANTIGO */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-1">
          <h3 className="font-bold text-gray-900">{investimento.ativo}</h3>
          <p className="text-sm text-gray-600">
            <strong>Saldo Atual Registrado:</strong> R$ {(investimento.valorInvestido || 0).toFixed(2)}
          </p>
        </div>

        {/* INPUT DE NOVO SALDO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Qual o novo saldo total hoje? (R$)
          </label>
          <Input
            type="number"
            value={novoSaldo}
            onChange={(e) => setNovoSaldo(e.target.value)}
            placeholder="Ex: 1250.00"
            step="0.01"
            min={0}
            required
            autoFocus
          />
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-6">
          <button 
            type="button" 
            onClick={() => closeModal()} 
            disabled={carregando} 
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={carregando || novoSaldo === ""} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50"
          >
            {carregando ? "Salvando..." : "Salvar Novo Saldo"}
          </button>
        </div>
      </form>
    </div>
  );
}