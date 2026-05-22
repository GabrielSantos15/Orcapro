"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
// Assumindo que as interfaces estão corretas nos seus arquivos
import Input from "../forms/Input";
import { useCategorias } from "@/hooks/useCategorias";
import { useContas } from "@/hooks/useContas";

export default function ModalTransacao() {
  const { closeModal, triggerUpdate } = useModalStore();
  const { categorias, loading: loadingCategorias } = useCategorias();
  const { contas, loading: loadingContas } = useContas();
    const { openModal } = useModalStore();

  const [tipoTransacao, setTipoTransacao] = useState<string>("RECEITA");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    contaId: "",
    categoriaId: "",
    origemDestino: "",
    descricao: "",
    valor: "",
    dataTransacao: "",
  });

  const loading = loadingContas || loadingCategorias;

  // Filtra categorias pelo tipo selecionado (RECEITA ou DESPESA)
  const categoriasFiltradas = categorias.filter(
    (cat) => cat.tipo === tipoTransacao
  );

  useEffect(() => {
    setFormData((prev) => ({ ...prev, categoriaId: "" }));
  }, [tipoTransacao]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        return;
      }

      const transacaoData = {
        tipo: tipoTransacao,
        conta: { id: formData.contaId },
        categoria: { id: formData.categoriaId },
        origemDestino: formData.origemDestino,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        // Adiciona o T00:00:00 para o Spring Boot aceitar como LocalDateTime (se necessário)
        dataTransacao: formData.dataTransacao ? `${formData.dataTransacao}T00:00:00` : "",
      };

      const response = await fetch("/api/transacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transacaoData),
      });

      if (response.ok) {
        // Idealmente usaríamos um toast (ex: react-hot-toast) em vez de alert
        alert("Transação criada com sucesso!"); 
        triggerUpdate();
        closeModal();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error || "Falha ao criar transação"}`);
      }
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      alert("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Nova Transação</h2>
      <p className="text-sm text-gray-500 mb-4">
        Preencha os dados para registrar no sistema.
      </p>
      <hr />
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {/* TIPO DE TRANSAÇÃO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Transação
          </label>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="receita"
                name="tipo"
                value="RECEITA"
                checked={tipoTransacao === "RECEITA"}
                onChange={(e) => setTipoTransacao(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="receita" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                Receita
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="despesa"
                name="tipo"
                value="DESPESA"
                checked={tipoTransacao === "DESPESA"}
                onChange={(e) => setTipoTransacao(e.target.value)}
                className="h-4 w-4 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="despesa" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                Despesa
              </label>
            </div>
          </div>
        </div>

        {/* CONTA */}
        <div>
          <label htmlFor="conta" className="block text-sm font-medium text-gray-700">
            Conta
          </label>
          <select
            id="conta"
            name="conta"
            value={formData.contaId}
            onChange={(e) => setFormData({ ...formData, contaId: e.target.value })}
            required
            disabled={loadingContas}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white disabled:bg-gray-100"
          >
            {/* CORREÇÃO 2: Feedback visual de carregamento */}
            <option value="" disabled>
              {loadingContas ? "Carregando contas..." : "Selecione uma conta"}
            </option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.instituicao} - {conta.tipo}
              </option>
            ))}
          </select>
        </div>

        {/* CATEGORIA */}
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
            Categoria ({tipoTransacao.toLowerCase()})
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoriaId}
            onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
            required
            disabled={loadingCategorias}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white disabled:bg-gray-100"
          >
            <option value="" disabled>
              {loadingCategorias ? "Carregando categorias..." : "Selecione uma categoria"}
            </option>
            {categoriasFiltradas.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
         <button
          className="hover:opacity-90 transition-opacity"
          onClick={() => openModal("categoria")}
        >
          Adicionar Categoria
        </button>
        </div>

        {/* ORIGEM / DESTINO */}
        <div>
          <label htmlFor="origem" className="block text-sm font-medium text-gray-700">
            {tipoTransacao === "RECEITA" ? "Origem (Quem pagou?)" : "Destino (Para quem pagou?)"}
          </label>
          <Input 
            type="text" 
            id="origem"
            name="origemDestino"
            value={formData.origemDestino}
            onChange={(e) => setFormData({ ...formData, origemDestino: e.target.value })}
            placeholder={tipoTransacao === "RECEITA" ? "Ex: Empresa X, Cliente Y" : "Ex: Supermercado, Padaria"}
          />
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea 
            name="descricao" 
            id="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Descreva a transação (opcional)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            rows={2}
          ></textarea>
        </div>

        {/* VALOR E DATA (Lado a Lado) */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700">
              Valor (R$)
            </label>
            <Input 
              type="number" 
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              placeholder="0.00"
              step="0.01"
              min={0.01}
              required
            />
          </div>

          <div className="flex-1">
            <label htmlFor="data" className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <Input 
              type="date" 
              id="data"
              name="dataTransacao"
              value={formData.dataTransacao}
              onChange={(e) => setFormData({ ...formData, dataTransacao: e.target.value })}
              required
            />
          </div>
        </div>

        {/* BOTÃO SUBMIT */}
        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded-md hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-opacity mt-6"
        >
          {submitting ? "Salvando..." : "Salvar Transação"}
        </button>
      </form>
    </div>
  );
}