import { Transacao } from "@/interfaces/Transacao";
import { useUtils } from "@/hooks/useUtils";
import { useModalStore } from "@/store/useModalStore";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useEffect } from "react";
import { formatarMoeda, obterDatasMesAtual } from "@/lib/utils";
import { useTransacoes } from "@/hooks/useTransacoes";
import { FiltroTransacao } from "@/interfaces/FiltroTransacao";

interface ListaTransacoesProps {
  filtro?: FiltroTransacao;
  limite?: number;
  variant?: "list" | "table";
}

export default function ListaTransacoes({ filtro, limite, variant = "list" }: ListaTransacoesProps) {
  const { openModal, atualizarGatilho } = useModalStore();
  const { transacoes, carregarTransacoes, carregando } = useTransacoes();
  const { formatarDiaMes } = useUtils();

  useEffect(() => {
    const filtroAplicado = filtro || obterDatasMesAtual();
    carregarTransacoes(filtroAplicado);
  }, [atualizarGatilho, filtro]);

  if (carregando) {
    return (
      <div className="flex flex-col p-4 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-2 w-1/2 rounded-md">
              <div className="h-4 w-3/4 skeleton rounded-md"></div>
              <div className="h-3 w-1/2 skeleton rounded-md"></div>
            </div>
            <div className="h-5 w-20 skeleton rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  if (transacoes.length === 0) {
    return (
      <p className="p-4 text-center text-[var(--text-muted)]">
        Nenhuma transação encontrada.
      </p>
    );
  }

  const transacoesExibidas = limite ? transacoes.slice(0, limite) : transacoes;

  const gridClasses = variant === "table"
    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center gap-2"
    : "flex justify-between items-center";

  return (
    <div className="w-full">
      {variant === "table" && (
        <div className="sticky top-0 grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 bg-[var(--bg-primary)] p-4 border-b border-[var(--border-color)] font-medium text-sm opacity-70">
          <span className="col-span-1">Transação</span>
          <span className="hidden md:block">Conta</span>
          <span className="hidden lg:block col-span-2">Descrição</span>
          <span className="text-right">Valor</span>
        </div>
      )}

      <ul className="flex flex-col max-h-[400px] overflow-y-auto pr-2">
        {transacoesExibidas.map((t) => (
          <li
            key={t.id}
            onClick={() => openModal("transacao", t)}
            className={`${gridClasses} p-4 border-b last:border-0 border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/40 transition-colors cursor-pointer text-sm`}
          >
            {/* Transação */}
            <div className="min-w-0 pr-2">
              <span className="block truncate font-medium">{t.origemDestino}</span>
              <p className="block truncate text-gray-500 text-xs mt-0.5">
                {formatarDiaMes(t.dataTransacao)} • {t.categoria.nome}
              </p>
            </div>

            {/*  Conta */}
            <div className={`hidden truncate ${variant === "table" ? "md:block " : "hidden"}`}>
              {t.conta.instituicao}
            </div>

            {/* Descrição */}
            <div className={`hidden col-span-2 truncate pr-4 ${variant === "table" ? "lg:block" : "hidden"}`}>
              <span className="truncate text-gray-500">{t.descricao || "-"}</span>
            </div>

            {/* Valor */}
            <div className="flex items-center justify-end gap-2 ml-auto shrink-0">
              <span className={`font-semibold ${t.categoria.tipo === "ENTRADA" ? "text-green-600" : "text-red-700"}`}>
                {t.categoria.tipo === "ENTRADA" ? "+" : "-"} {formatarMoeda(t.valor)}
              </span>
              {t.categoria.tipo === "ENTRADA" ? (
                <FaArrowUp size={14} className="text-green-600" />
              ) : (
                <FaArrowDown size={14} className="text-red-700" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}