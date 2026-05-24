"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import { useContas } from "@/hooks/useContas";
import Input from "../forms/Input";
import { Investimento } from "@/interfaces/Investimento";

interface FormInvestimentoModalProps {
  investimento?: Investimento | null;
}

export default function FormInvestimentoModal({ investimento }: FormInvestimentoModalProps) {
  const { closeModal } = useModalStore();
  const { createInvestimento, updateInvestimento, criandoInvestimento, atualizandoId } = useInvestimentos();
  const { contas, carregando: loadingContas } = useContas();

  const isEditMode = !!investimento;
  const [erro, setErro] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    idConta: "",
    ativo: "",
    tipo: "RENDA_FIXA",
    valorInvestido: "",
    percentual: "",
    indicador: "CDI",
    dataAplicacao: new Date().toISOString().split("T")[0],
  });

  const tiposInvestimento = ["RENDA_FIXA", "RENDA_VARIAVEL", "CRIPTOMOEDAS", "FUNDOS", "OUTROS"];
  const indicadores = ["CDI", "IPCA", "SELIC", "PREFIXADO", "IBOVESPA", "OUTRO"];

  // Preenche dados ao carregar contas ou em modo de edição
  useEffect(() => {
    if (investimento) {
      setFormData({
        idConta: String(investimento.conta?.id || ""),
        ativo: investimento.ativo || "",
        tipo: investimento.tipo || "RENDA_FIXA",
        valorInvestido: String(investimento.valorInvestido || ""),
        percentual: String(investimento.percentual || ""),
        indicador: investimento.indicador || "CDI",
        dataAplicacao: investimento.dataAplicacao?.split("T")[0] || new Date().toISOString().split("T")[0],
      });
    } else if (!loadingContas && contas.length > 0) {
      setFormData((prev) => ({ ...prev, idConta: String(contas[0].id) }));
    }
  }, [investimento, contas, loadingContas]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);

    // Validações
    if (!formData.idConta) {
      setErro("Por favor, selecione uma conta vinculada.");
      return;
    }

    if (!formData.ativo.trim()) {
      setErro("Nome do ativo/investimento é obrigatório.");
      return;
    }

    // Rentabilidade é obrigatória apenas para não-renda variável
    if (formData.tipo !== "RENDA_VARIAVEL") {
      if (!formData.percentual || parseFloat(formData.percentual) < 0) {
        setErro("Rentabilidade deve ser um número válido.");
        return;
      }
    }

    if (!isEditMode && (!formData.valorInvestido || parseFloat(formData.valorInvestido) <= 0)) {
      setErro("Valor a investir deve ser maior que zero.");
      return;
    }

    try {
      const payload = {
        contaId: formData.idConta,
        tipo: formData.tipo,
        valorInvestido: formData.valorInvestido,
        percentual: formData.tipo === "RENDA_VARIAVEL" ? "0" : formData.percentual,
        indicador: formData.indicador,
        dataAplicacao: formData.dataAplicacao,
      };

      if (isEditMode) {
        await updateInvestimento(investimento.id, {
          ...payload,
          ativo: formData.ativo,
          status: investimento.status,
        });
        alert("Investimento atualizado com sucesso!");
      } else {
        await createInvestimento(payload);
        alert("Investimento criado com sucesso!");
      }

      closeModal();
    } catch (err: any) {
      setErro(err.message || "Erro ao processar a operação");
    }
  };

  const isLoading = criandoInvestimento || (isEditMode && atualizandoId === investimento?.id);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">
        {isEditMode ? "Editar Investimento" : "Novo Investimento"}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {isEditMode
          ? "Altere os dados de rendimento e informações do ativo."
          : "Preencha os dados da sua aplicação. O valor sairá da conta selecionada."}
      </p>
      <hr className="mb-4" />

      <form onSubmit={handleSubmit} className="space-y-4">
        {erro && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {erro}
          </div>
        )}

        {/* NOME DO ATIVO - PRIMEIRO */}
        <div>
          <label htmlFor="ativo" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Ativo
          </label>
          <Input
            type="text"
            id="ativo"
            name="ativo"
            value={formData.ativo}
            onChange={handleChange}
            placeholder="Ex: CDB Banco Inter, Tesouro Selic..."
            required
          />
        </div>

        {/* CONTA VINCULADA */}
        <div>
          <label htmlFor="idConta" className="block text-sm font-medium text-gray-700 mb-1">
            Conta de Origem
          </label>
          <select
            id="idConta"
            name="idConta"
            value={formData.idConta}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100"
            required
            disabled={loadingContas}
          >
            <option value="" disabled>
              {loadingContas ? "Carregando contas..." : "Selecione uma conta"}
            </option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.instituicao} - R$ {conta.saldo?.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {/* TIPO E INDICADOR */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {tiposInvestimento.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="indicador" className="block text-sm font-medium text-gray-700 mb-1">
              Indicador {formData.tipo === "RENDA_VARIAVEL" && <span className="text-gray-500 font-normal">(opcional)</span>}
            </label>
            <select
              id="indicador"
              name="indicador"
              value={formData.indicador}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {formData.tipo === "RENDA_VARIAVEL" && (
                <option value="">Nenhum indicador</option>
              )}
              {indicadores.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PERCENTUAL - Apenas para não renda variável */}
        {formData.tipo !== "RENDA_VARIAVEL" && (
          <div>
            <label htmlFor="percentual" className="block text-sm font-medium text-gray-700 mb-1">
              Rentabilidade (%)
            </label>
            <Input
              type="number"
              id="percentual"
              name="percentual"
              value={formData.percentual}
              onChange={handleChange}
              placeholder="Ex: 100"
              step="0.1"
              min="0"
              required
            />
          </div>
        )}

        {/* DATA DA APLICAÇÃO */}
        <div>
          <label htmlFor="dataAplicacao" className="block text-sm font-medium text-gray-700 mb-1">
            Data da Aplicação
          </label>
          <Input
            type="date"
            id="dataAplicacao"
            name="dataAplicacao"
            value={formData.dataAplicacao}
            onChange={handleChange}
            required
          />
        </div>

        {/* VALOR INVESTIDO - Apenas na criação */}
        {!isEditMode && (
          <div>
            <label htmlFor="valorInvestido" className="block text-sm font-medium text-gray-700 mb-1">
              Valor a Investir (R$)
            </label>
            <Input
              type="number"
              id="valorInvestido"
              name="valorInvestido"
              value={formData.valorInvestido}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>
        )}

        {/* BOTÕES */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || loadingContas}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? isEditMode
                ? "Atualizando..."
                : "Aplicando..."
              : isEditMode
              ? "Atualizar"
              : "Aplicar"}
          </button>
        </div>
      </form>
    </div>
  );
}