"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Input from "../forms/Input";
import Select from "../forms/Select"; // Componente customizado
import { Meta } from "@/interfaces/Meta";
import { Conta } from "@/interfaces/Conta";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface FormProgressoMetaModalProps {
  meta: Meta;
}

export default function FormProgressoMetaModal({
  meta,
}: FormProgressoMetaModalProps) {
  const { closeModal, triggerUpdate } = useModalStore();
  const [submitting, setSubmitting] = useState(false);
  const [contas, setContas] = useState<Conta[]>([]);
  const [carregandoContas, setCarregandoContas] = useState(true);

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
    const valorAporte = parseFloat(formData.valor);

    if (!valorAporte || valorAporte <= 0) {
      alert("O valor deve ser maior que zero.");
      return;
    }

    if (!formData.contaId) {
      alert("Selecione uma conta de origem.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("user_token");
      if (!token) throw new Error("Sessão expirada.");

      const response = await fetch(`/api/meta/${meta.id}/progresso`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        const error = await response.json();
        alert(`Erro: ${error.error || "Falha ao guardar dinheiro"}`);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

  const falta = meta.valorAlvo - meta.valorAtual;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
          <PlusCircle className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Guardar Dinheiro</h2>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Destine um valor para a meta{" "}
        <span className="font-semibold text-purple-600">{meta.nome}</span>.
      </p>

      {/* Resumo visual do objetivo */}
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 mb-6">
        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
          Falta para atingir
        </p>
        <p className="text-3xl font-bold text-purple-900">
          {formatarMoeda(falta)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Valor a guardar (R$)"
          type="number"
          name="valor"
          value={formData.valor}
          onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
          placeholder="0.00"
          step="0.01"
          min={0.01}
          required
          autoFocus
        />

        <Select
          label="De qual conta o dinheiro vai sair?"
          name="contaId"
          value={formData.contaId}
          onChange={(e) =>
            setFormData({ ...formData, contaId: e.target.value })
          }
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
          disabled={submitting || contas.length === 0}
          className="w-full mt-2 bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {submitting ? "Processando..." : "Confirmar e Guardar"}
        </button>
      </form>
    </div>
  );
}
