"use client";

import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import Input from "../../forms/Input";
import { Investimento } from "@/interfaces/Investimento";
import { PiggyBank } from "lucide-react";
import { toast } from "sonner";

interface InvestimentoAporteFormModalProps {
  investimento: Investimento;
}

export default function InvestimentoAporteFormModal({
  investimento,
}: InvestimentoAporteFormModalProps) {
  const { closeModal } = useModalStore();
  const { aportar, aporteEmProgresso } = useInvestimentos();
  
  const [formData, setFormData] = useState({
    valorAporte: "",
  });

  const [erro, setErro] = useState<string | null>(null);

  // Função para limpar a máscara de moeda (converte "1.500,00" para 1500.00)
  const getValorNumerico = (valorStr: string) => {
    if (!valorStr) return 0;
    const valorSemPonto = valorStr.replace(/\./g, "");
    const valorComPontoDec = valorSemPonto.replace(",", ".");
    return parseFloat(valorComPontoDec) || 0;
  };

  const valorDigitado = getValorNumerico(formData.valorAporte);
  const saldoAtual = investimento.valorInvestido || 0;
  const totalAposAporte = saldoAtual + valorDigitado;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErro(null); 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);

    try {
      const valorFinalAporte = getValorNumerico(formData.valorAporte);

      if (valorFinalAporte <= 0) {
        throw new Error("Insira um valor válido e maior que zero para o aporte.");
      }

      await aportar(investimento.id, valorFinalAporte);
      toast.success("Aporte realizado com sucesso!");
      closeModal();
    } catch (err: any) {
      setErro(err.message || "Erro ao conectar com o servidor.");
    }
  };

  return (
    <div>
      {/* HEADER AJUSTADO */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--primary-light)] border border-[var(--border-color)] text-[var(--primary-color)] rounded-[var(--radius-md)]">
          <PiggyBank className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            Novo Aporte
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Adicione dinheiro. Será descontado da sua conta vinculada.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* MENSAGEM DE ERRO */}
        {erro && (
          <div className="p-4 bg-[var(--danger-color)]/10 text-[var(--danger-color)] border border-[var(--danger-color)]/20 rounded-xl text-sm font-medium">
            {erro}
          </div>
        )}

        {/* RESUMO DO INVESTIMENTO */}
        <div className="p-4 bg-[var(--bg-input)] rounded-xl border border-[var(--border-color)] flex flex-col gap-2">
          <h3 className="font-bold text-lg text-[var(--text-primary)]">{investimento.ativo}</h3>
          
          <div className="grid grid-cols-2 gap-2 text-sm mt-1">
            <p className="text-[var(--text-muted)]">
              <strong className="text-[var(--text-secondary)]">Tipo:</strong> {investimento.tipo.replace("_", " ")}
            </p>
            <p className="text-[var(--text-muted)]">
              <strong className="text-[var(--text-secondary)]">Banco:</strong> {investimento.conta.instituicao}
            </p>
          </div>

          <div className="h-px bg-[var(--border-color)] my-2"></div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-[var(--text-muted)]">Saldo Atual:</p>
            <p className="font-medium text-[var(--text-primary)]">R$ {saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          
          <div className="flex justify-between items-center text-[var(--primary-color)]">
            <p className="text-sm font-semibold">Novo Saldo (Prévia):</p>
            <p className="font-bold text-lg">R$ {totalAposAporte.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* INPUT DE VALOR */}
        <Input
          label="Qual valor deseja aportar?"
          type="number"
          isCurrency={true}
          name="valorAporte"
          value={formData.valorAporte}
          onChange={handleChange}
          placeholder="0.00"
          required
        />

        {/* BOTÕES DE AÇÃO */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={aporteEmProgresso}
            className="cursor-pointer flex-1 px-4 py-3 text-[var(--text-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] hover:bg-[var(--bg-primary)] font-semibold transition disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={aporteEmProgresso || valorDigitado <= 0}
            className="cursor-pointer flex-1 bg-[var(--primary-color)] text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] shadow-md hover:bg-[var(--primary-hover)] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aporteEmProgresso ? "Processando..." : "Confirmar Aporte"}
          </button>
        </div>
      </form>
    </div>
  );
}