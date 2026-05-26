// components/widgets/ListaTransacoes.tsx
import { Transacao } from "@/interfaces/Transacao";
import { useUtils } from "@/hooks/useUtils";
import { useModalStore } from "@/store/useModalStore";
import { FaArrowCircleDown, FaArrowCircleUp, FaArrowDown, FaArrowUp } from "react-icons/fa";

interface ListaTransacoesProps {
  transacoes: Transacao[];
}

export default function ListaTransacoes({ transacoes }: ListaTransacoesProps) {
  const { openModal } = useModalStore();
  const { formatarDiaMes } = useUtils();
  if (transacoes.length === 0) {
    return (
      <p className="p-4 text-center text-gray-500">
        Nenhuma transação encontrada.
      </p>
    );
  }

  return (
    <ul className="flex flex-col max-h-[400px] overflow-y-auto pr-2">
      {transacoes.map((t) => (
        <li
          key={t.id}
          onClick={() => openModal("transacao", t)}
          className="flex justify-between items-center p-4 border-b last:border-0 border-gray-100 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex-1 min-w-0 pr-4">
            <span className="block truncate font-medium text-gray-800">
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
