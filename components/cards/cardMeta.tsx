"use client";

import { useModalStore } from "@/store/useModalStore";
import { useRouter } from "next/navigation";

interface MetaCardProps {
  meta: {
    id: number;
    nome: string;
    descricao: string;
    valorAlvo: number;
    valorAtual: number;
  };
}

export function MetaCard({ meta }: MetaCardProps) {
  const { openModal } = useModalStore();
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
      className="w-full max-w-[200px] aspect-square p-4 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer"
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
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
            fill="none"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#a855f7"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="origin-center -rotate-90 transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold text-gray-900 mb-0.5">
            {Math.round(percentual)}%
          </span>

          <span className="text-sm font-semibold text-gray-600 truncate max-w-[100px]">
            {meta.nome}
          </span>
        </div>
      </div>
    </button>
  );
}
