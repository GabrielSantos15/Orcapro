"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Input from "../forms/Input";
import { Meta } from "@/interfaces/Meta";
import { Conta } from "@/interfaces/Conta";
import { useMetas } from "@/hooks/useMetas"; // Importando o nosso hook atualizado

interface FormResgateMetaModalProps {
  meta: Meta;
}

export default function FormResgateMetaModal({ meta }: FormResgateMetaModalProps) {
  const { closeModal } = useModalStore();
  const { resgatarProgresso, resgatandoProgressoId } = useMetas(); // Usando a função do hook!
  
  const [contas, setContas] = useState<Conta[]>([]);
  const [carregandoContas, setCarregandoContas] = useState(true);

  const [formData, setFormData] = useState({
    valor: "",
    contaId: "",
  });

  // Busca as contas do usuário para ele escolher para onde o dinheiro vai voltar
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
      alert("O valor deve ser maior que zero.");
      return;
    }

    if (!formData.contaId) {
      alert("Selecione uma conta de destino.");
      return;
    }

    // Validação de segurança: Não pode resgatar mais do que tem guardado!
    if (valorResgate > meta.valorAtual) {
      alert(`Você não pode resgatar mais do que possui guardado nesta meta (Saldo: R$ ${meta.valorAtual.toFixed(2)}).`);
      return;
    }

    try {
      // Chama a função direto do hook, passando os 3 parâmetros
      await resgatarProgresso(
        meta.id, 
        valorResgate, 
        parseInt(formData.contaId)
      );
      
      alert("Dinheiro resgatado com sucesso! O valor já voltou para sua conta.");
      closeModal();
    } catch (error: any) {
      alert(error.message || "Erro ao resgatar dinheiro.");
    }
  };

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  const submitting = resgatandoProgressoId === meta.id;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Resgatar Dinheiro</h2>
      <p className="text-sm text-gray-500 mb-4">
        Retire um valor da meta <strong className="text-blue-600">{meta.nome}</strong>.
      </p>
      <hr />

      {/* Resumo visual do saldo disponível para resgate */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 my-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Saldo disponível</p>
          <p className="text-lg font-bold text-blue-900">{formatarMoeda(meta.valorAtual)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* VALOR A RESGATAR */}
        <div>
          <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">
            Valor a resgatar (R$)
          </label>
          <Input
            type="number"
            id="valor"
            name="valor"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            placeholder="Ex: 50.00"
            step="0.01"
            min={0.01}
            max={meta.valorAtual} // Limita o input HTML também
            required
            autoFocus
          />
        </div>

        {/* CONTA DE DESTINO */}
        <div>
          <label htmlFor="contaId" className="block text-sm font-medium text-gray-700 mb-1">
            Para qual conta o dinheiro vai voltar?
          </label>
          <select
            id="contaId"
            name="contaId"
            value={formData.contaId}
            onChange={(e) => setFormData({ ...formData, contaId: e.target.value })}
            disabled={carregandoContas || contas.length === 0}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white disabled:bg-gray-100"
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
        </div>

        {/* BOTÃO SUBMIT */}
        <button
          type="submit"
          disabled={submitting || contas.length === 0 || meta.valorAtual <= 0}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors mt-6"
        >
          {submitting ? "Processando..." : "Confirmar Resgate"}
        </button>
      </form>
    </div>
  );
}