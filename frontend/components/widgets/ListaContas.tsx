import { listaBancosPopulares, useContas } from "@/hooks/useContas";
import { Conta } from "@/interfaces/Conta";
import { getLogoBanco } from "@/lib/contaUtils";
import { formatarMoeda } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";
import { Wallet } from "lucide-react";
import Image from "next/image";

export default function ListaContas() {
  const { openModal } = useModalStore();
  const { contas, carregando } = useContas();
  const contasOrdenadas = [...contas].sort((a, b) => (b.saldo || 0) - (a.saldo || 0));

  if (carregando) {
    return (
      <div className="flex flex-col h-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between p-3 border-b border-[var(--border-color)] last:border-0 w-full">
            <div className="flex gap-2 w-full">
              <div className="w-[40px] h-[40px] skeleton rounded shrink-0"></div>

              <div className="flex flex-col gap-2 justify-center">
                <div className="h-4 skeleton rounded-md w-24"></div>
                <div className="h-3 skeleton rounded-md w-16"></div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="h-5 skeleton rounded-md w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contas.length === 0) {
    return (
      <p className="p-4 text-center text-[var(--text-muted)]">Nenhuma conta cadastrada</p>
    );
  }

  return (
    <ul className="flex flex-col h-full">
      {contasOrdenadas.filter(c => c.ativa !== false).map((c) => (
        <li
          key={c.id}
          onClick={() => openModal("conta", c)}
          className="flex justify-between p-3 border-b border-[var(--border-color)] last:border-0 text-sm cursor-pointer hover:bg-[var(--bg-secondary)]/50"
        >
          <div className="flex gap-2">
            <figure className="h-full">
              {c.instituicao === "Carteira" ? (
                <div className="w-10 h-10 bg-[var(--bg-primary)] rounded flex items-center justify-center">
                  <Wallet size={24} />
                </div>):
                <Image
                  src={getLogoBanco(c.instituicao)}
                  alt={c.instituicao}
                  width={40}
                  height={40}
                  className="rounded object-contain"
                />}
            </figure>
            <div className="flex flex-col">
              <h4 className="font-medium">{c.instituicao}</h4>
              <p className="text-gray-500">{c.tipo}</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="font-medium">{formatarMoeda(c.saldo)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}