"use client";

import { Investimento } from "@/interfaces/Investimento";
import { useModalStore } from "@/store/useModalStore";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Pencil,
  Landmark,
  CircleDollarSign,
  Bitcoin,
  Info,
  RefreshCw,
  Trash2
} from "lucide-react";

interface ListaInvestimentosProps {
  investimentos: Investimento[];
}

export default function ListaInvestimentos({ 
  investimentos
}: ListaInvestimentosProps) {
  const { openModal } = useModalStore();
  const { deletarInvestimento } = useInvestimentos();
  
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case "RENDA_FIXA": return <Landmark className="w-5 h-5 text-blue-500" />;
      case "RENDA_VARIAVEL": return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case "CRIPTOMOEDAS": return <Bitcoin className="w-5 h-5 text-orange-500" />;
      default: return <CircleDollarSign className="w-5 h-5 text-purple-500" />;
    }
  };

  const getCorFundoTipo = (tipo: string) => {
    switch (tipo) {
      case "RENDA_FIXA": return "bg-blue-50";
      case "RENDA_VARIAVEL": return "bg-emerald-50";
      case "CRIPTOMOEDAS": return "bg-orange-50";
      default: return "bg-purple-50";
    }
  };

  if (!investimentos || investimentos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
        <Wallet className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Nenhum investimento encontrado</h3>
        <p className="text-sm text-gray-500 mt-1">Você ainda não possui aplicações cadastradas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* BANNER INFORMATIVO */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-blue-900">Sobre o saldo dos investimentos</h4>
          <p className="text-sm text-blue-800 mt-1 leading-relaxed">
            Seu dinheiro pode render diariamente. Caso o valor real na sua corretora esteja diferente do registrado aqui, clique no ícone de recarregar ao lado do saldo para sincronizar e manter seu patrimônio atualizado!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investimentos.map((inv) => (
          <div key={inv.id} className={`relative bg-white rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md flex flex-col ${!inv.ativoStatus ? "opacity-75 grayscale-[0.5] border-gray-200" : "border-gray-100"}`}>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${getCorFundoTipo(inv.tipo)}`}>
                  {getIconeTipo(inv.tipo)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight">{inv.ativo}</h3>
                  <span className="text-xs text-gray-500 font-medium">{inv.conta?.instituicao}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!inv.ativoStatus && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase">Inativo</span>
                )}
                <button onClick={() => openModal("updateInvestimento",inv)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-6 flex-grow">
              <p className="text-sm text-gray-500 mb-1">Saldo Atual Registrado</p>
              <div className="flex items-center gap-2">
                <h2 className={`text-2xl font-bold tracking-tight ${!inv.ativoStatus ? "text-gray-500" : "text-gray-900"}`}>
                  {formatarMoeda(inv.valorInvestido)}
                </h2>
                
                {/* === BOTÃO DE ATUALIZAR RENDIMENTO === */}
                {inv.ativoStatus && (
                  <button 
                    onClick={() => openModal("updateSaldoInvestimento", inv)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Atualizar rendimento"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md">
                  <TrendingUp className="w-3 h-3" />
                  {inv.percentual}% {inv.indicador}
                </span>
              </div>
            </div>

            {inv.ativoStatus ? (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => openModal("aporteInvestimento", inv)} className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold">
                  <ArrowUpCircle className="w-4 h-4" /> Aportar
                </button>
                <button onClick={() => openModal("resgateInvestimento", inv)} className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm font-semibold">
                  <ArrowDownCircle className="w-4 h-4" /> Resgatar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => openModal("aporteInvestimento", inv)} className="flex items-center justify-center gap-2 py-2 px-3 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg text-sm font-semibold">
                  <ArrowUpCircle className="w-4 h-4" /> Reativar
                </button>
                <button onClick={() => deletarInvestimento(inv.id)} className="flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-semibold">
                  <Trash2 className="w-4 h-4" /> Deletar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}