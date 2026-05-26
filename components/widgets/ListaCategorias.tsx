import { Categoria } from "@/interfaces/Categoria";
import { useModalStore } from "@/store/useModalStore";
import { useCategorias } from "@/hooks/useCategorias";
import { 
  Landmark, 
  Briefcase, 
  TrendingUp, 
  Utensils, 
  CarFront, 
  Home, 
  Activity, 
  Gamepad2, 
  HelpCircle,
  X
} from "lucide-react";
import { FaBullseye } from "react-icons/fa";


interface ListaCategoriasProps {
  categorias: Categoria[];
}

const getIconeCategoria = (nome: string) => {
  const mapaIcones: Record<string, React.ReactNode> = {
    "Salário": <Landmark size={20} />,
    "Freelance": <Briefcase size={20} />,
    "Investimentos": <TrendingUp size={20} />,
    "Metas": <FaBullseye size={20} />,
    "Alimentação": <Utensils size={20} />,
    "Transporte": <CarFront size={20} />,
    "Moradia": <Home size={20} />,
    "Saúde": <Activity size={20} />,
    "Lazer": <Gamepad2 size={20} />,
    "Outros": <HelpCircle size={20} />
  };

  return mapaIcones[nome] || <span className="font-bold">{nome.charAt(0).toUpperCase()}</span>;
};

const getCorFundo = (tipo: string) => {
  return tipo === "ENTRADA" 
    ? "bg-green-100 text-green-600" 
    : "bg-red-100 text-red-500";
};

export default function ListaCategorias({ categorias }: ListaCategoriasProps) {
  const { openModal } = useModalStore();
  const { deletarCategoria } = useCategorias();

  const categoriasAtivas = categorias.filter((c) => c.ativa !== false && c.nome !== "Outros");

  if (categoriasAtivas.length === 0) {
    return <p className="p-4 text-center text-gray-500">Nenhuma categoria ativa.</p>;
  }

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja deletar esta categoria?")) {
      try {
        await deletarCategoria(id);
      } catch (err) {
        alert("Erro ao deletar categoria");
      }
    }
  };

  return (
    <ul className="flex flex-col h-full">
      {categoriasAtivas.map((c) => (
        <li
          key={c.id}
          className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded flex items-center justify-center shadow-sm ${getCorFundo(c.tipo)}`}>
              {getIconeCategoria(c.nome)}
            </div>
            <div className="flex flex-col">
              <h4 className="font-medium text-gray-800">{c.nome}</h4>
              <p className="text-gray-500 text-xs mt-0.5">{c.tipo}</p>
            </div>
          </div>
          <button
            onClick={(e) => handleDelete(c.id, e)}
            className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-red-500 rounded transition-colors"
            title="Deletar categoria"
          >
            <X size={22} />
          </button>
        </li>
      ))}
    </ul>
  );
}