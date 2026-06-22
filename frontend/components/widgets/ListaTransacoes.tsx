import { Transacao } from "@/interfaces/Transacao";
import { useUtils } from "@/hooks/useUtils";
import { useModalStore } from "@/store/useModalStore";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useEffect } from "react";
import { obterDatasMesAtual } from "@/lib/utils";
import { useTransacoes } from "@/hooks/useTransacoes";
import { FiltroTransacao } from "@/interfaces/FiltroTransacao";

interface ListaTransacoesProps {
  filtro?: FiltroTransacao; 
  limite?: number; 
}

export default function ListaTransacoes({ filtro, limite }: ListaTransacoesProps) {
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

  return (
    <ul className="flex flex-col max-h-[400px] overflow-y-auto pr-2">
      {transacoesExibidas.map((t) => (
        <li
          key={t.id}
          onClick={() => openModal("transacao", t)}
          className="flex justify-between items-center p-4 border-b last:border-0 border-[var(--border-color)] text-sm hover:bg-[var(--bg-secondary)]/40 transition-colors cursor-pointer"
        >
          <div className="flex-1 min-w-0 pr-4">
            <span className="block truncate font-medium">
              {t.origemDestino}
            </span>
            <p className="block truncate text-gray-500 text-xs mt-0.5">
              {formatarDiaMes(t.dataTransacao)} • {t.categoria.nome}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-right">
            <span
              className={`font-semibold tracking-tight ${
                t.categoria.tipo === "ENTRADA" ? "text-green-600" : "text-red-700"
              }`}
            >
              {t.categoria.tipo === "ENTRADA" ? "+ " : "- "}R$ {t.valor}
            </span>

            {t.categoria.tipo === "ENTRADA" ? (
              <FaArrowUp size={14} className="text-green-500 shrink-0" />
            ) : (
              <FaArrowDown size={14} className="text-red-500 shrink-0" />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}