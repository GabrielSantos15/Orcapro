"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Input from "../../forms/Input";
import Select from "../../forms/Select";
import { Meta } from "@/interfaces/Meta";
import { Conta } from "@/interfaces/Conta";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface MetaProgressoFormModalProps {
  meta: Meta;
}

export default function MetaProgressoFormModal({
  meta,
}: MetaProgressoFormModalProps) {
  const { closeModal, triggerUpdate } = useModalStore();
  const [submitting, setSubmitting] = useState(false);
  const [contas, setContas] = useState<Conta[]>([]);
  const [carregandoContas, setCarregandoContas] = useState(true);
  
  // Estado para armazenar mensagens de erro locais
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
    setErro(null); // Limpa erros anteriores antes de tentar novamente

    // Limpeza da máscara de moeda (ex: "1.500,00" -> 1500.00)
    const getValorNumerico = (valorStr: string) => {
      if (!valorStr) return 0;
      const valorSemPonto = valorStr.replace(/\./g, "");
      const valorComPontoDec = valorSemPonto.replace(",", ".");
      return parseFloat(valorComPontoDec) || 0;
    };

    const valorAporte = getValorNumerico(formData.valor);

    if (!valorAporte || valorAporte <= 0) {
      setErro("O valor deve ser maior que zero.");
      return;
    }

    if (!formData.contaId) {
      setErro("Selecione uma conta de origem.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/meta/${meta.id}/progresso`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          valor: valorAporte,
          contaId: parseInt(formData.contaId),
        }),
      });

      if (response.ok) {
        toast.success("Dinheiro guardado com sucesso!");
        triggerUpdate();
        closeModal();
      } else {
        const errorData = await response.json();
        setErro(`${errorData.error || "Falha ao guardar dinheiro"}`);
      }
    } catch (error) {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

  const falta = Math.max(0, meta.valorAlvo - meta.valorAtual);

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--primary-light)] border border-[var(--border-color)] text-[var(--primary-color)] rounded-[var(--radius-md)]">
          <PlusCircle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">Guardar Dinheiro</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Destine um valor para a meta{" "}
            <span className="font-semibold text-[var(--primary-color)]">{meta.nome}</span>.
          </p>
        </div>
      </div>

      {/* MENSAGEM DE ERRO */}
      {erro && (
        <div className="mb-6 p-4 bg-[var(--danger-color)]/10 text-[var(--danger-color)] rounded-xl text-sm font-medium">
          {erro}
        </div>
      )}

      {/* RESUMO VISUAL DO OBJETIVO */}
      <div className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl p-5 mb-6">
        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
          Falta para atingir
        </p>
        <p className="text-3xl font-bold text-[var(--primary-color)]">
          {formatarMoeda(falta)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* INPUT COM MÁSCARA */}
        <Input
          label="Valor a guardar"
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
          label="De qual conta o dinheiro vai sair?"
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
            disabled={submitting || contas.length === 0}
            className="cursor-pointer flex-1 bg-[var(--primary-color)] text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] shadow-md hover:bg-[var(--primary-hover)] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Processando..." : "Confirmar e Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}