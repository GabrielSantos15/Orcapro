"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Input from "../../forms/Input";
import Select from "../../forms/Select";
import { Meta } from "@/interfaces/Meta";
import { Conta } from "@/interfaces/Conta";
import { useMetas } from "@/hooks/useMetas";
import { ArrowDownToLine } from "lucide-react";
import { toast } from "sonner";

interface FormResgateMetaModalProps {
  meta: Meta;
}

export default function MetaResgateFormModal({ meta }: FormResgateMetaModalProps) {
  const { closeModal } = useModalStore();
  const { resgatarProgresso, resgatandoProgressoId } = useMetas();

  const [contas, setContas] = useState<Conta[]>([]);
  const [carregandoContas, setCarregandoContas] = useState(true);
  
  // Estado de erro local
  const [erro, setErro] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    valor: "",
    contaId: "",
  });

  useEffect(() => {
    const fetchContas = async () => {
      try {
        const res = await fetch("/api/conta");
        if (res.ok) {
          const data = await res.json();
          setContas(data);
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, contaId: String(data[0].id) }));
          }
        }
      } catch (error) {
        console.error("Erro ao buscar contas:", error);
      } finally {
        setCarregandoContas(false);
      }
    };
    fetchContas();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null); // Limpa o erro ao tentar enviar

    // Limpeza da máscara de moeda (ex: "1.500,00" -> 1500.00)
    const getValorNumerico = (valorStr: string) => {
      if (!valorStr) return 0;
      const valorSemPonto = valorStr.replace(/\./g, "");
      const valorComPontoDec = valorSemPonto.replace(",", ".");
      return parseFloat(valorComPontoDec) || 0;
    };

    const valorResgate = getValorNumerico(formData.valor);

    if (!valorResgate || valorResgate <= 0) {
      setErro("O valor de resgate deve ser maior que zero.");
      return;
    }

    if (!formData.contaId) {
      setErro("Selecione uma conta de destino.");
      return;
    }

    if (valorResgate > meta.valorAtual) {
      setErro(`Você não pode resgatar mais do que possui guardado: (Disponível: R$ ${meta.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}).`);
      return;
    }

    try {
      await resgatarProgresso(meta.id, valorResgate, parseInt(formData.contaId));
      toast.success("Resgate realizado com sucesso!");
      closeModal();
    } catch (error: any) {
      setErro(error.message || "Erro ao resgatar dinheiro.");
    }
  };

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  const submitting = resgatandoProgressoId === meta.id;

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--primary-light)] border border-[var(--border-color)] text-[var(--primary-color)] rounded-[var(--radius-md)]">
          <ArrowDownToLine className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">Resgatar Dinheiro</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Retire um valor da meta <span className="font-semibold text-[var(--primary-color)]">{meta.nome}</span>.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* MENSAGEM DE ERRO */}
        {erro && (
          <div className="p-4 bg-[var(--danger-color)]/10 text-[var(--danger-color)] rounded-xl text-sm font-medium">
            {erro}
          </div>
        )}

        {/* RESUMO VISUAL DO SALDO DISPONÍVEL */}
        <div className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl p-5 mb-2">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
            Saldo disponível para resgate
          </p>
          <p className="text-3xl font-bold text-[var(--primary-color)]">
            {formatarMoeda(meta.valorAtual)}
          </p>
        </div>

        {/* INPUT COM MÁSCARA */}
        <Input
          label="Valor a resgatar"
          type="number"
          isCurrency={true}
          name="valor"
          value={formData.valor}
          onChange={(e) => {
            setFormData({ ...formData, valor: e.target.value });
            if (erro) setErro(null); 
          }}
          placeholder="0.00"
          step="0.01"
          required
          autoFocus
        />

        <Select
          label="Para qual conta o dinheiro vai voltar?"
          name="contaId"
          value={formData.contaId}
          onChange={(e) => {
             setFormData({ ...formData, contaId: e.target.value });
             if (erro) setErro(null);
          }}
          disabled={carregandoContas || contas.length === 0}
          required
        >
          {carregandoContas ? (
            <option value="">Carregando contas...</option>
          ) : contas.length === 0 ? (
            <option value="">Nenhuma conta cadastrada</option>
          ) : (
            contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.instituicao} ({formatarMoeda(conta.saldo)})
              </option>
            ))
          )}
        </Select>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={submitting}
            className="cursor-pointer flex-1 px-4 py-3 text-[var(--text-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] hover:bg-[var(--bg-primary)] font-semibold transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={submitting || contas.length === 0 || meta.valorAtual <= 0}
            className="cursor-pointer flex-1 bg-[var(--primary-color)] text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] shadow-md hover:bg-[var(--primary-hover)] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Processando..." : "Confirmar Resgate"}
          </button>
        </div>
      </form>
    </div>
  );
}