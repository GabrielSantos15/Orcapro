"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaChartPie, FaExchangeAlt, FaBullseye, FaPlus } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    router.push("/");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FaChartPie size={20} /> },
    { label: "Movimentações", path: "/dashboard/movimentacao", icon: <FaExchangeAlt size={20} /> },
    { label: "Investimentos", path: "/dashboard/investimentos", icon: <FaBullseye size={20} /> },
    { label: "Metas", path: "/dashboard/metas", icon: <FaBullseye size={20} /> },
  ];

  return (
    <>
      <aside className="hidden md:flex bg-[var(--secondary-background)] p-6 h-full w-64 flex-col mb-3 ">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <span className="text-purple-600">Orça</span>
          <span className="text-purple-400">Pro</span>
        </h1>
        
        <nav className="flex-1 flex flex-col gap-3 justify-start">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                pathname === item.path
                  ? "bg-purple-600 text-white font-semibold shadow-md shadow-purple-500/30"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-100 pt-6 mt-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 text-red-500 font-semibold rounded-xl transition duration-200 flex justify-center items-center gap-2 hover:bg-red-50"
          >
            <FiLogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* ==========================================
          MOBILE: BOTTOM NAVIGATION (Oculta no desktop)
          ========================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="flex justify-between items-center px-6 h-20 relative">
          
          {/* LADO ESQUERDO: Dashboard e Movimentações */}
          <Link 
            href="/dashboard" 
            className={`flex flex-col items-center gap-1 p-2 ${pathname === "/dashboard" ? "text-purple-600" : "text-gray-400"}`}
          >
            <FaChartPie size={22} />
            <span className="text-[10px] font-medium">Início</span>
          </Link>

          <Link 
            href="/dashboard/movimentacao" 
            className={`flex flex-col items-center gap-1 p-2 mr-6 ${pathname === "/dashboard/movimentacao" ? "text-purple-600" : "text-gray-400"}`}
          >
            <FaExchangeAlt size={22} />
            <span className="text-[10px] font-medium">Transações</span>
          </Link>


          {/* LADO DIREITO: Metas e Sair */}
          <Link 
            href="/dashboard/metas" 
            className={`flex flex-col items-center gap-1 p-2 ml-6 ${pathname === "/dashboard/metas" ? "text-purple-600" : "text-gray-400"}`}
          >
            <FaBullseye size={22} />
            <span className="text-[10px] font-medium">Metas</span>
          </Link>

          <button 
            onClick={handleLogout} 
            className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-red-500"
          >
            <FiLogOut size={22} />
            <span className="text-[10px] font-medium">Sair</span>
          </button>

        </div>
      </nav>
    </>
  );
}