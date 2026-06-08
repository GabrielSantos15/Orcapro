"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Input from "../forms/Input";
import Select from "../forms/Select"; // Componente customizado
import { Meta } from "@/interfaces/Meta";
import { Conta } from "@/interfaces/Conta";
import { useMetas } from "@/hooks/useMetas";
import { ArrowDownToLine } from "lucide-react";
import { toast } from "sonner";

interface FormResgateMetaModalProps {
  meta: Meta;
}

export default function FormResgateMetaModal({ meta }: FormResgateMetaModalProps) {
  const { closeModal } = useModalStore();
  const { resgatarProgresso, resgatandoProgressoId } = useMetas();
  
  const [contas, setContas] = useState<Conta[]>([]);
  const [carregandoContas, setCarregandoContas] = useState(true);
  const [formData, setFormData] = useState({
    valor: "",
    contaId: "",
  });

  useEffect(() => {
    const fetchContas = async () => {
      try {
        const token = localStorage.getItem("user_token");
        const res = await fetch("/api/conta", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    const valorResgate = parseFloat(formData.valor);

    if (!valorResgate || valorResgate <= 0) {
      toast.error("Transação atualizada com sucesso!");("O valor deve ser maior que zero.");
      return;
    }
    if (!formData.contaId) {
      toast.error("Selecione uma conta de destino.");
      return;
    }
    if (valorResgate > meta.valorAtual) {
      toast.error(`Você não pode resgatar mais do que possui guardado (Disponível: R$ ${meta.valorAtual.toFixed(2)}).`);
      return;
    }

    try {
      await resgatarProgresso(meta.id, valorResgate, parseInt(formData.contaId));
      toast.success("Resgate realizado com sucesso!");
      closeModal();
    } catch (error: any) {
      toast.error(error.message || "Erro ao resgatar dinheiro.");
    }
  };

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  const submitting = resgatandoProgressoId === meta.id;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
          <ArrowDownToLine className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Resgatar Dinheiro</h2>
      </div>
      
      <p className="text-sm text-gray-500 mb-6">
        Retire um valor da meta <span className="font-semibold text-purple-600">{meta.nome}</span>.
      </p>

      {/* Resumo visual do saldo disponível */}
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 mb-6">
        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">Saldo disponível para resgate</p>
        <p className="text-3xl font-bold text-purple-900">{formatarMoeda(meta.valorAtual)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Valor a resgatar (R$)"
          type="number"
          name="valor"
          value={formData.valor}
          onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
          placeholder="0.00"
          step="0.01"
          min={0.01}
          max={meta.valorAtual}
          required
          autoFocus
        />

        <Select
          label="Para qual conta o dinheiro vai voltar?"
          name="contaId"
          value={formData.contaId}
          onChange={(e) => setFormData({ ...formData, contaId: e.target.value })}
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

        <button
          type="submit"
          disabled={submitting || contas.length === 0 || meta.valorAtual <= 0}
          className="w-full mt-2 bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {submitting ? "Processando..." : "Confirmar Resgate"}
        </button>
      </form>
    </div>
  );
}