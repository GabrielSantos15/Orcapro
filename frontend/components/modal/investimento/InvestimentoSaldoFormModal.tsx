"use client";

import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import Input from "../../forms/Input";
import { Investimento } from "@/interfaces/Investimento";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface InvestimentoSaldoFormModalProps {
  investimento: Investimento;
}

export default function InvestimentoSaldoFormModal({
  investimento,
}: InvestimentoSaldoFormModalProps) {
  const { closeModal, triggerUpdate } = useModalStore();

  const [novoSaldo, setNovoSaldo] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      // Limpeza da máscara de moeda (ex: "1.500,00" -> 1500.00)
      const getValorNumerico = (valorStr: string) => {
        if (!valorStr) return 0;
        const valorSemPonto = valorStr.replace(/\./g, "");
        const valorComPontoDec = valorSemPonto.replace(",", ".");
        return parseFloat(valorComPontoDec) || 0;
      };

      const valorFormatado = getValorNumerico(novoSaldo);

      if (isNaN(valorFormatado) || valorFormatado < 0) {
        throw new Error("Informe um saldo válido. Não pode ser negativo.");
      }

      const response = await fetch(
        `/api/investimento/${investimento.id}/saldo`,
        {
          method: "PATCH",
          body: JSON.stringify({ novoSaldo: valorFormatado }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao atualizar o saldo.");
      }

      toast.success("Saldo sincronizado com sucesso!");
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
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[var(--primary-light)] border border-[var(--border-color)] text-[var(--primary-color)] rounded-[var(--radius-md)]">
          <RefreshCw className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-medium text-[var(--text-primary)]">
          Sincronizar Rendimento
        </h2>
      </div>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        Atualize o valor exato deste investimento baseado nos rendimentos da corretora.<br />
        <span className="font-semibold text-[var(--text-secondary)]">Isso não altera o saldo da sua conta bancária.</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {erro && (
          <div className="p-4 bg-[var(--danger-color)]/10 text-[var(--danger-color)] border border-[var(--danger-color)]/20 rounded-xl text-sm font-medium">
            {erro}
          </div>
        )}

        <div className="p-5 bg-[var(--bg-input)] rounded-xl border border-[var(--border-color)] text-center">
          <p className="text-sm text-[var(--text-muted)] mb-1 uppercase tracking-wider font-medium">
            Saldo Atual Registrado
          </p>
          <p className="text-3xl font-bold text-[var(--text-primary)]">
            R$ {(investimento.valorInvestido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <Input
          label="Qual o novo saldo total hoje?"
          type="number"
          isCurrency={true}
          value={novoSaldo}
          onChange={(e) => {
            setNovoSaldo(e.target.value);
            if (erro) setErro(null);
          }}
          placeholder="0.00"
          required
          autoFocus
        />

        {/* BOTÕES */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={carregando}
            className="cursor-pointer flex-1 px-4 py-3 text-[var(--text-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] hover:bg-[var(--bg-primary)] font-semibold transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={carregando || novoSaldo === ""}
            className="cursor-pointer flex-1 px-4 py-3 bg-[var(--primary-color)] text-white rounded-[var(--radius-md)] shadow-md hover:bg-[var(--primary-hover)] hover:shadow-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {carregando ? "Salvando..." : "Salvar Novo Saldo"}
          </button>
        </div>
      </form>
    </div>
  );
}