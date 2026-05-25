"use client";

import Button from "@/components/button/Button";
import { MetaCard } from "@/components/cards/cardMeta";
import Header from "@/components/header/Header";
import ListaMetas from "@/components/widgets/ListaMetas";
import { useMetas } from "@/hooks/useMetas";
import { useModalStore } from "@/store/useModalStore";
import {
  Target,
  TrendingUp,
  Trash2,
  Pencil,
  Zap,
  Plus,
  Minus,
} from "lucide-react";

export default function Metas() {
  const { openModal } = useModalStore();
  const { metas, deletarMeta, carregando, erro } = useMetas();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  if (carregando) {
    return (
      <div>
        <Header title="Minhas Metas" />
        <p className="text-center text-gray-500 mt-8">Carregando metas...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div>
        <Header title="Minhas Metas" />
        <p className="text-center text-[var(--primary-color)] mt-8">
          Erro ao carregar metas: {erro}
        </p>
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-3 xl:p-4">
      <Header title="Minhas Metas" />
      <div className="mb-6">
        <Button onClick={() => openModal("createMeta")}>
          + Adicionar Meta
        </Button>
      </div>
      {metas.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
          <Target className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            Nenhuma meta encontrada
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Comece a definir suas metas financeiras!
          </p>
        </div>
      ) : (
        <ListaMetas metas={metas}></ListaMetas>
      )}
    </div>
  );
}
