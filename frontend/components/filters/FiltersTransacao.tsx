"use client";

import { Categoria } from "@/interfaces/Categoria";
import { Conta } from "@/interfaces/Conta";
import { FaFilterCircleXmark } from "react-icons/fa6";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DatePicker } from "../forms/DatePicker";
import { FiltroTransacao } from "@/interfaces/FiltroTransacao";

interface FiltersTransacaoProps {
  categorias: Categoria[];
  contas: Conta[];
  filtro: FiltroTransacao;
  setFiltro: React.Dispatch<React.SetStateAction<FiltroTransacao>>;
  onApply: () => void;
  onClear: () => void;
}

export default function FiltersTransacao({ 
  categorias, 
  contas, 
  filtro, 
  setFiltro, 
  onApply, 
  onClear 
}: FiltersTransacaoProps) {

  const atualizarFiltro = (campo: keyof FiltroTransacao, valor: string) => {
    setFiltro((prev) => ({
      ...prev,
      [campo]:
        valor === ""
          ? undefined
          : campo === "categoriaId" || campo === "contaId"
            ? Number(valor)
            : valor,
    }));
  };

  return (
    <div className="rounded-lg flex flex-wrap gap-2 items-end">
      {/* Conta */}
      <div className="flex flex-col">
        <label className="text-sm">Conta</label>
        <Select
          value={filtro.contaId?.toString() ?? "all"}
          onValueChange={(value) => atualizarFiltro("contaId", value === "all" ? "" : value)}
        >
          <SelectTrigger className="min-w-[100px]">
            <SelectValue placeholder="Todas as contas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {contas.map((conta) => (
              <SelectItem key={conta.id} value={conta.id.toString()}>
                {conta.instituicao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categoria */}
      <div className="flex flex-col">
        <label className="text-sm">Categoria</label>
        <Select
          value={filtro.categoriaId?.toString() ?? "all"}
          onValueChange={(value) => atualizarFiltro("categoriaId", value === "all" ? "" : value)}
        >
          <SelectTrigger className="min-w-[100px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {[...categorias]
              .sort((a, b) => {
                if (a.nome === "Outros") return 1;
                if (b.nome === "Outros") return -1;
                return a.nome.localeCompare(b.nome);
              })
              .map((categoria) => (
                <SelectItem key={categoria.id} value={categoria.id.toString()}>
                  {categoria.nome === "Outros"
                    ? `Outros - ${categoria.tipo === "ENTRADA" ? "Entrada" : "Saída"}`
                    : categoria.nome}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tipo */}
      <div className="flex flex-col">
        <label className="text-sm">Tipo</label>
        <Select
          value={filtro.tipo ?? "all"}
          onValueChange={(value) => atualizarFiltro("tipo", value === "all" ? "" : value)}
        >
          <SelectTrigger className="min-w-[100px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ENTRADA">Entrada</SelectItem>
            <SelectItem value="SAIDA">Saída</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Inicial */}
      <div className="flex flex-col">
        <label className="text-sm">Data Inicial</label>
        <DatePicker
          value={filtro.dataInicio}
          onChange={(value) => atualizarFiltro("dataInicio", value ?? "")}
        />
      </div>

      {/* Data Final */}
      <div className="flex flex-col">
        <label className="text-sm">Data Final</label>
        <DatePicker
          value={filtro.dataFim}
          onChange={(value) => atualizarFiltro("dataFim", value ?? "")}
        />
      </div>

      {/* Ações não precisam de lógica, só avisam o Pai que foram clicadas */}
      <button
        onClick={onApply}
        className="cursor-pointer font-medium bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white rounded-lg py-1 px-3"
      >
        Aplicar
      </button>

      <button
        onClick={onClear}
        className="cursor-pointer flex items-center gap-2 rounded-lg border border-[var(--border-color)] py-1 px-3 hover:text-[var(--primary-color)] transition-all duration-200"
      >
        <FaFilterCircleXmark />
        Limpar
      </button>
    </div>
  );
}