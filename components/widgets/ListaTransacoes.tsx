// components/widgets/ListaTransacoes.tsx
import { Transacao } from "@/interfaces/Transacao";

interface ListaTransacoesProps {
  transacoes: Transacao[];
}

export default function ListaTransacoes({ transacoes }: ListaTransacoesProps) {
  if (transacoes.length === 0) {
    return <p className="p-4 text-center text-gray-500">Nenhuma transação encontrada.</p>;
  }

  return (
    <ul className="flex flex-col">
      {transacoes.map((t) => (
        <li 
          key={t.id} 
          className="flex justify-between items-center p-4 border-b last:border-0 border-gray-100 text-sm hover:bg-gray-50  transition-colors"
        >
          <div>
            <span className="font-semibold ">{t.origemDestino}</span>
            <p className="text-gray-500 text-xs mt-0.5">
              R${t.valor} • {t.categoria.nome}
            </p>
          </div>
          <span className="text-red-500 font-semibold">
            {t.dataTransacao}
          </span>
        </li>
      ))}
    </ul>
  );
}