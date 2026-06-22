import { listaBancosPopulares, useContas } from "@/hooks/useContas";
import { Conta } from "@/interfaces/Conta";
import { useModalStore } from "@/store/useModalStore";
import Image from "next/image";

export default function ListaContas() {
  const { openModal } = useModalStore();
  const { contas, carregando } = useContas();

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
      <p className="p-4 text-center text-gray-500">Nenhuma conta encontrada.</p>
    );
  }

  const getBancoLogo = (instituicao: string) => {
    const banco = listaBancosPopulares.find(
      (b) => b.nome.toLowerCase() === instituicao.toLowerCase(),
    );
    return banco?.logo || "/bancos/default.png";
  };

  return (
    <ul className="flex flex-col h-full">
      {contas.filter(c => c.ativa !== false).map((c) => (
        <li
          key={c.id}
          onClick={() => openModal("conta", c)}
          className="flex justify-between p-3 border-b border-[var(--border-color)] last:border-0 text-sm cursor-pointer hover:bg-[var(--bg-secondary)]/50"
        >
          <div className="flex gap-2">
            <figure>
              <Image
                src={getBancoLogo(c.instituicao)}
                alt={c.instituicao}
                width={40}
                height={40}
                className="rounded"
              />
            </figure>
            <div className="flex flex-col">
              <h4 className="font-medium">{c.instituicao}</h4>
              <p className="text-gray-500">{c.tipo}</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="font-medium">R$ {c.saldo}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}