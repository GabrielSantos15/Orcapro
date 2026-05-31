"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Input from "../forms/Input";
import Select from "../forms/Select";
import { Investimento } from "@/interfaces/Investimento";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import { useContas } from "@/hooks/useContas";
import { TrendingUp } from "lucide-react";

interface FormInvestimentoModalProps {
  investimento?: Investimento | null;
}

export default function FormInvestimentoModal({
  investimento,
}: FormInvestimentoModalProps) {
  const { closeModal } = useModalStore();
  const {
    createInvestimento,
    updateInvestimento,
    criandoInvestimento,
    atualizandoId,
  } = useInvestimentos();
  const { contas, carregando: loadingContas } = useContas();

  const isEditMode = !!investimento;
  const [erro, setErro] = useState<string | null>(null);
  const [saldoContaSelecionada, setSaldoContaSelecionada] = useState<number>(0);

  const [formData, setFormData] = useState({
    idConta: "",
    ativo: "",
    tipo: "RENDA_FIXA",
    valorInvestido: "",
    percentual: "",
    indicador: "CDI",
    dataAplicacao: new Date().toISOString().split("T")[0],
  });

  const tiposInvestimento = [
    "RENDA_FIXA",
    "RENDA_VARIAVEL",
    "CRIPTOMOEDAS",
    "FUNDOS",
    "OUTROS",
  ];
  const indicadores = [
    "CDI",
    "IPCA",
    "SELIC",
    "PREFIXADO",
    "IBOVESPA",
    "OUTRO",
  ];

  useEffect(() => {
    if (investimento) {
      const contaSelecionada = contas.find((c) => c.id === investimento.conta?.id);
      setSaldoContaSelecionada(contaSelecionada?.saldo || 0);
      setFormData({
        idConta: String(investimento.conta?.id || ""),
        ativo: investimento.ativo || "",
        tipo: investimento.tipo || "RENDA_FIXA",
        valorInvestido: String(investimento.valorInvestido || ""),
        percentual: String(investimento.percentual || ""),
        indicador: investimento.indicador || "CDI",
        dataAplicacao:
          investimento.dataAplicacao?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      });
    } else if (!loadingContas && contas.length > 0) {
      setSaldoContaSelecionada(contas[0].saldo || 0);
      setFormData((prev) => ({ ...prev, idConta: String(contas[0].id) }));
    }
  }, [investimento, contas, loadingContas]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Atualiza saldo quando muda a conta
    if (name === "idConta") {
      const contaSelecionada = contas.find((c) => String(c.id) === value);
      setSaldoContaSelecionada(contaSelecionada?.saldo || 0);
    }

    // Valida saldo insuficiente
    if (name === "valorInvestido") {
      const valor = parseFloat(value);
      if (valor > saldoContaSelecionada) {
        setErro(`Saldo insuficiente. Saldo disponível: R$ ${saldoContaSelecionada.toFixed(2)}`);
      } else {
        setErro(null);
      }
    } else {
      setErro(null);
    }
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const contaSelecionada = contas.find((c) => String(c.id) === formData.idConta);
      
      if (!contaSelecionada) {
        throw new Error("Conta não encontrada.");
      }

      const valorInvestido = parseFloat(formData.valorInvestido);

      // Validação de saldo insuficiente (apenas em modo criação)
      if (!isEditMode && valorInvestido > contaSelecionada.saldo) {
        setErro(`Saldo insuficiente. Saldo disponível: R$ ${contaSelecionada.saldo.toFixed(2)}`);
        return;
      }

      const payload = {
        conta: contaSelecionada,
        ativo: formData.ativo,
        tipo: formData.tipo,
        valorInvestido: valorInvestido,
        percentual: formData.tipo === "RENDA_VARIAVEL" ? 0 : parseFloat(formData.percentual),
        indicador: formData.indicador,
        dataAplicacao: formData.dataAplicacao,
        ativoStatus: investimento ? investimento.ativoStatus : true,
      };

      if (isEditMode) {
        await updateInvestimento(investimento!.id, payload);
        alert("Investimento atualizado com sucesso!");
      } else {
        await createInvestimento(payload);
        alert("Investimento criado com sucesso!");
      }

      closeModal();
    } catch (err: any) {
      setErro(err.message || "Erro ao salvar investimento.");
    }
  };

  const isLoading =
    criandoInvestimento || (isEditMode && atualizandoId === investimento?.id);

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Editar Investimento" : "Novo Investimento"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        {erro && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200 font-medium">
            {erro}
          </div>
        )}

        <Input
          label="Nome do Ativo"
          name="ativo"
          value={formData.ativo}
          onChange={handleChange}
          placeholder="Ex: CDB Banco Inter"
          required
        />

        <Select
          label="Conta de Origem"
          name="idConta"
          value={formData.idConta}
          onChange={handleChange}
          disabled={loadingContas}
          required
        >
          <option value="" disabled>
            Selecione uma conta
          </option>
          {contas.map((conta) => (
            <option key={conta.id} value={conta.id}>
              {conta.instituicao} - R$ {conta.saldo.toFixed(2)}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
          >
            {tiposInvestimento.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo.replace("_", " ")}
              </option>
            ))}
          </Select>
          <Select
            label="Indicador"
            name="indicador"
            value={formData.indicador}
            onChange={handleChange}
          >
            {indicadores.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {formData.tipo !== "RENDA_VARIAVEL" && (
            <Input
              label="Rentabilidade (%)"
              type="number"
              name="percentual"
              value={formData.percentual}
              onChange={handleChange}
              step="0.1"
              required
            />
          )}
          <Input
            label="Data da Aplicação"
            type="date"
            name="dataAplicacao"
            value={formData.dataAplicacao}
            onChange={handleChange}
            required
          />
        </div>

        {!isEditMode && (
          <Input
            label="Valor a Investir (R$)"
            type="number"
            name="valorInvestido"
            value={formData.valorInvestido}
            onChange={handleChange}
            step="0.01"
            required
          />
        )}

        <button
          type="submit"
          disabled={isLoading || !!erro}
          className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Salvando..."
            : isEditMode
              ? "Atualizar Investimento"
              : "Aplicar Investimento"}
        </button>
      </form>
    </div>
  );
}
