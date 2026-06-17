// components/widgets/ListaTransacoes.tsx
import { listaBancosPopulares } from "@/hooks/useContas";
import { Conta } from "@/interfaces/Conta";
import { useModalStore } from "@/store/useModalStore";
import Image from "next/image";

interface ListaContaProps {
  contas: Conta[];
}

export default function ListaContas({ contas }: ListaContaProps) {
  const { openModal } = useModalStore();
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
          <div>
            <span>R$ {c.saldo}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
