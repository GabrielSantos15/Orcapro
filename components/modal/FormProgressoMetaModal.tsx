"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Input from "../forms/Input";
import { Meta } from "@/interfaces/Meta";
import { Conta } from "@/interfaces/Conta";

interface FormProgressoMetaModalProps {
  meta: Meta;
}

export default function FormProgressoMetaModal({ meta }: FormProgressoMetaModalProps) {
  const { closeModal, triggerUpdate } = useModalStore();
  const [submitting, setSubmitting] = useState(false);
  const [contas, setContas] = useState<Conta[]>([]);
  const [carregandoContas, setCarregandoContas] = useState(true);

  const [formData, setFormData] = useState({
    valor: "",
    contaId: "",
  });

  // Busca as contas do usuário para ele escolher de onde o dinheiro vai sair
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
          // Se tiver contas, já seleciona a primeira por padrão
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

    // Validação extra: não deixar guardar mais do que falta (opcional, mas boa prática)
    const falta = meta.valorAlvo - meta.valorAtual;
    if (valorAporte > falta) {
      const confirmacao = confirm(`Você está guardando mais do que o necessário (Faltam apenas R$ ${falta.toFixed(2)}). Deseja continuar?`);
      if (!confirmacao) return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("user_token");
      if (!token) throw new Error("Sessão expirada.");

      // Chama a rota PATCH que vamos criar no Next.js
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
        alert("Dinheiro guardado com sucesso! 🎉");
        triggerUpdate();
        closeModal();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error || "Falha ao guardar dinheiro"}`);
      }
    } catch (error) {
      console.error("Erro ao aportar:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  const falta = meta.valorAlvo - meta.valorAtual;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Guardar Dinheiro</h2>
      <p className="text-sm text-gray-500 mb-4">
        Destine um valor para a meta <strong className="text-[var(--primary-color)]">{meta.nome}</strong>.
      </p>
      <hr />

      {/* Resumo visual do objetivo */}
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 my-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">Falta para atingir</p>
          <p className="text-lg font-bold text-purple-900">{formatarMoeda(falta)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* VALOR A GUARDAR */}
        <div>
          <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">
            Valor a guardar (R$)
          </label>
          <Input
            type="number"
            id="valor"
            name="valor"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            placeholder="Ex: 150.00"
            step="0.01"
            min={0.01}
            required
            autoFocus
          />
        </div>

        {/* CONTA DE ORIGEM */}
        <div>
          <label htmlFor="contaId" className="block text-sm font-medium text-gray-700 mb-1">
            De qual conta o dinheiro vai sair?
          </label>
          <select
            id="contaId"
            name="contaId"
            value={formData.contaId}
            onChange={(e) => setFormData({ ...formData, contaId: e.target.value })}
            disabled={carregandoContas || contas.length === 0}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm px-3 py-2 border bg-white disabled:bg-gray-100"
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
          </select>
          {contas.length === 0 && !carregandoContas && (
            <p className="text-xs text-red-500 mt-1">Você precisa cadastrar uma conta primeiro.</p>
          )}
        </div>

        {/* BOTÃO SUBMIT */}
        <button
          type="submit"
          disabled={submitting || contas.length === 0}
          className="w-full bg-[var(--primary-color)] text-white py-3 rounded-md hover:opacity-90 disabled:bg-gray-400 font-medium transition-colors mt-6"
        >
          {submitting ? "Processando..." : "Confirmar e Guardar"}
        </button>
      </form>
    </div>
  );
}