"use client";

import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import Input from "../../forms/Input";
import { Investimento } from "@/interfaces/Investimento";
import { ArrowDownLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner"; // Adicionado para manter o padrão de notificações

interface InvestimentoResgateModalProps {
  investimento: Investimento;
}

export default function InvestimentoResgateFormModal({
  investimento,
}: InvestimentoResgateModalProps) {
  const { closeModal } = useModalStore();
  const { resgatar, resgateEmProgresso } = useInvestimentos();

  const [formData, setFormData] = useState({
    valorResgatado: "",
    saldoRemanescente: "",
  });

  const [erro, setErro] = useState<string | null>(null);

  // Função para limpar a máscara de moeda (converte "1.500,00" para 1500.00)
  const getValorNumerico = (valorStr: string) => {
    if (!valorStr) return 0;
    const valorSemPonto = valorStr.replace(/\./g, "");
    const valorComPontoDec = valorSemPonto.replace(",", ".");
    return parseFloat(valorComPontoDec) || 0;
  };

  const valorAtualRegistrado = investimento.valorInvestido || 0;
  const valorResgatadoNum = getValorNumerico(formData.valorResgatado);
  const saldoRemanescenteNum = getValorNumerico(formData.saldoRemanescente);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);

    try {
      if (!formData.valorResgatado || valorResgatadoNum <= 0) {
        throw new Error("O valor de resgate deve ser maior que zero.");
      }
      if (formData.saldoRemanescente === "" || saldoRemanescenteNum < 0) {
        throw new Error(
          "Informe o saldo remanescente válido (digite 0 se resgatar tudo)."
        );
      }

      await resgatar(investimento.id, valorResgatadoNum, saldoRemanescenteNum);
      toast.success("Resgate realizado com sucesso!");
      closeModal();
    } catch (err: any) {
      setErro(err.message || "Erro ao conectar com o servidor.");
    }
  };

  const isZerarCarteira =
    formData.saldoRemanescente !== "" && saldoRemanescenteNum === 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[var(--primary-light)] border border-[var(--border-color)] text-[var(--primary-color)] rounded-[var(--radius-md)]">
          <ArrowDownLeft className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-medium text-[var(--text-primary)]">
          Resgatar Investimento
        </h2>
      </div>

      <p className="text-sm text-[var(--text-muted)] mb-6">
        Retire o dinheiro da sua aplicação e atualize o saldo real da sua corretora.
      </p>

      {erro && (
        <div className="mb-6 p-4 bg-[var(--danger-color)]/10 text-[var(--danger-color)] rounded-xl text-sm font-medium">
          {erro}
        </div>
      )}

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* RESUMO DO INVESTIMENTO */}
        <div className="p-5 bg-[var(--bg-input)] rounded-xl border border-[var(--border-color)] flex flex-col items-center justify-center text-center">
          <p className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">
            {investimento.ativo}
          </p>
          <p className="text-3xl font-bold text-[var(--text-primary)]">
            R$ {valorAtualRegistrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Saldo registrado no app</p>
        </div>

        {/* INPUTS (Com isCurrency) */}
        <Input
          label="Qual valor você está sacando? (R$)"
          type="number"
          isCurrency={true}
          name="valorResgatado"
          value={formData.valorResgatado}
          onChange={handleChange}
          placeholder="0.00"
          required
          autoFocus
        />

        <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)]">
          <Input
            label="Quanto sobrou na corretora? (R$)"
            type="number"
            isCurrency={true}
            name="saldoRemanescente"
            value={formData.saldoRemanescente}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
          <p className="text-xs text-[var(--text-muted)] mt-3 leading-relaxed">
            Consulte o app da corretora e digite o valor exato restante. Digite{" "}
            <strong className="text-[var(--text-primary)]">0</strong> se resgatar tudo.
          </p>

          {/* ALERTA DE ZERAR CARTEIRA */}
          {isZerarCarteira && (
            <div className="flex items-center gap-2 mt-4 text-xs font-medium bg-amber-500/10 text-amber-500 p-3 rounded-lg border border-amber-500/20">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>
                Este investimento será marcado como inativo ao zerar o saldo.
              </span>
            </div>
          )}
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={resgateEmProgresso}
            className="cursor-pointer flex-1 px-4 py-3 text-[var(--text-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] hover:bg-[var(--bg-primary)] font-semibold transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={
              resgateEmProgresso ||
              formData.valorResgatado === "" ||
              formData.saldoRemanescente === ""
            }
            className="cursor-pointer flex-1 px-4 py-3 bg-[var(--primary-color)] text-white rounded-[var(--radius-md)] shadow-md hover:bg-[var(--primary-hover)] hover:shadow-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resgateEmProgresso ? "Processando..." : "Confirmar Resgate"}
          </button>
        </div>
      </form>
    </div>
  );
}