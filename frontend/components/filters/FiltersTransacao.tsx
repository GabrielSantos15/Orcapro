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
    setFiltro((prev) => {
      const novoFiltro = { ...prev };

      if (valor === "" || valor === "all") {
        (novoFiltro as any)[campo] = undefined;
      } else {
        (novoFiltro as any)[campo] = (campo === "categoriaId" || campo === "contaId") ? Number(valor) : valor;
      }

      if (campo === "categoriaId" && valor !== "all" && valor !== "") {
        const catSelecionada = categorias.find((c) => c.id === Number(valor));
        if (catSelecionada) {
          novoFiltro.tipo = catSelecionada.tipo;
        }
      }

      if (campo === "tipo" && valor !== "all" && valor !== "") {
        const catAtual = categorias.find((c) => c.id === prev.categoriaId);
        if (catAtual && catAtual.tipo !== valor) {
          novoFiltro.categoriaId = undefined;
        }
      }

      return novoFiltro;
    });
  };

  const handleMesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value; 

    if (!valor) {
      setFiltro((prev) => ({ ...prev, dataInicio: "", dataFim: "" }));
      return;
    }

    const [ano, mes] = valor.split("-");
    const ultimoDiaObj = new Date(Number(ano), Number(mes), 0);
    const ultimoDia = String(ultimoDiaObj.getDate()).padStart(2, "0");

    setFiltro((prev) => ({
      ...prev,
      dataInicio: `${ano}-${mes}-01`,
      dataFim: `${ano}-${mes}-${ultimoDia}`,
    }));
  };

  const categoriasFiltradas = categorias.filter((c) => {
    if (!filtro.tipo) return true;
    return c.tipo === filtro.tipo;
  });

  return (
    <div className="rounded-lg grid grid-cols-2 gap-3 items-end md:flex md:flex-wrap md:gap-2">

      {/* Conta */}
      <div className="flex flex-col col-span-1">
        <label className="text-sm text-[var(--text-muted)]">Conta</label>
        <Select
          value={filtro.contaId?.toString() ?? "all"}
          onValueChange={(value) => atualizarFiltro("contaId", value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-full md:w-auto min-w-[100px]">
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
      <div className="flex flex-col col-span-1">
        <label className="text-sm text-[var(--text-muted)]">Categoria</label>
        <Select
          value={filtro.categoriaId?.toString() ?? "all"}
          onValueChange={(value) => atualizarFiltro("categoriaId", value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-full md:w-auto min-w-[100px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {[...categoriasFiltradas]
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
      <div className="flex flex-col col-span-2 md:col-span-1">
        <label className="text-sm text-[var(--text-muted)]">Tipo</label>
        <Select
          value={filtro.tipo ?? "all"}
          onValueChange={(value) => atualizarFiltro("tipo", value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-full md:w-auto min-w-[100px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ENTRADA">Entrada</SelectItem>
            <SelectItem value="SAIDA">Saída</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mês de Referência */}
      <div className="flex flex-col col-span-2 md:col-span-1">
        <label className="text-sm text-[var(--text-muted)]">Mês de Referência</label>
        <input
          type="month"
          className="border border-[var(--border-color)] rounded-lg px-2 text-sm text-[var(--text-color)] bg-[var(--bg-surface)]  focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] h-8"
          onChange={handleMesChange}
          value={filtro.dataInicio ? filtro.dataInicio.substring(0, 7) : ""}
        />
      </div>

      {/* Ações */}
      <div className="col-span-2 flex justify-end gap-2 mt-1 md:mt-0">
        <button
          onClick={onApply}
          className="cursor-pointer font-medium bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white rounded-lg py-1 px-3"
        >
          Aplicar
        </button>

        <button
          onClick={onClear}
          className="cursor-pointer flex items-center gap-2 rounded-lg border border-[var(--border-color)] py-1 px-3 hover:text-[var(--primary-hover)] transition-all duration-200"
        >
          <FaFilterCircleXmark />
          Limpar
        </button>
      </div>
    </div>
  );
}