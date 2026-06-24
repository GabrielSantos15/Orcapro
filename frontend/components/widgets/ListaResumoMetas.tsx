"use client";

import { useMetas } from "@/hooks/useMetas";
import { useRouter } from "next/navigation"; 

interface ListaResumoMetasProps {
  limite?: number;
}

interface MetaCardProps {
  meta: {
    id: number;
    nome: string;
    descricao: string;
    valorAlvo: number;
    valorAtual: number;
  };
}

function MetaCard({ meta }: MetaCardProps) {
  const router = useRouter(); 

  const percentual =
    meta.valorAlvo > 0
      ? Math.min((meta.valorAtual / meta.valorAlvo) * 100, 100)
      : 0;

  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentual / 100) * circumference;

  return (
    <button
      onClick={() => router.push("/dashboard/metas")}
      className="group w-full max-w-[200px] aspect-square p-4 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full overflow-visible"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-[var(--border-color)]" 
            strokeWidth={strokeWidth}
            fill="none"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-[var(--primary-color)] origin-center -rotate-90 transition-all duration-1000 ease-out group-hover:drop-shadow-[0_0_5px_var(--secondary-color)]" 
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold text-[var(--text-primary)] mb-0.5">
            {Math.round(percentual)}%
          </span>

          <span className="text-sm font-semibold text-[var(--text-secondary)] truncate max-w-[100px]">
            {meta.nome}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function ListaResumoMetas({ limite }: ListaResumoMetasProps) {
  const { metas, carregando } = useMetas();

  if (carregando) {
    const quantidadeSkeletons = limite || 3; 
    
    return (
      <div className="flex gap-6 overflow-x-auto p-4">
        {Array.from({ length: quantidadeSkeletons }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-40 h-40 skeleton rounded-full"></div>
        ))}
      </div>
    );
  }

  const metasOrdenadas = metas.sort(
    (a, b) => new Date(a.dataLimite).getTime() - new Date(b.dataLimite).getTime()
  );

  const metasExibidas = limite ? metasOrdenadas.slice(0, limite) : metasOrdenadas;

  if (metasExibidas.length === 0) {
    return (
      <p className="text-center text-[var(--text-muted)] py-8">
        Nenhuma meta encontrada
      </p>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto p-4">
      {metasExibidas.map((meta) => (
        <div key={meta.id} className="flex-shrink-0">
          <MetaCard
            meta={{
              id: meta.id,
              nome: meta.nome,
              descricao: meta.descricao,
              valorAlvo: meta.valorAlvo,
              valorAtual: meta.valorAtual,
            }}
          />
        </div>
      ))}
    </div>
  );
}