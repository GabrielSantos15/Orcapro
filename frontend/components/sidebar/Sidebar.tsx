"use client";

import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaChartPie, FaExchangeAlt, FaBullseye } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import ThemeToggle from "../themeToggle/ThemeToggle";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    if (confirm("Tem certeza que deseja sair?")) {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/");
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FaChartPie size={24} /> },
    {
      label: "Movimentações",
      path: "/dashboard/movimentacao",
      icon: <FaExchangeAlt size={24} />,
    },
    {
      label: "Investimentos",
      path: "/dashboard/investimentos",
      icon: <TrendingUp size={24} />,
    },
    {
      label: "Metas",
      path: "/dashboard/metas",
      icon: <FaBullseye size={24} />,
    },
  ];

  return (
    <>
      <aside className="hidden md:flex bg-[var(--bg-secondary)] p-6 h-full w-64 flex-col mb-3">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <span className="">Orça</span>
          <span className="text-[var(--primary-color)]">Pro</span>
        </h1>

        <nav className="flex-1 flex flex-col gap-3 justify-start">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                pathname === item.path
                  ? "bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white font-semibold shadow-md "
                  : "text-gray-600 hover:bg-[var(--primary-color)]/10 hover:text-bg-[var(--primary-hover)] dark:hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <ThemeToggle />
        <div className="border-t border-gray-100 pt-6 mt-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 text-red-500 font-semibold rounded-xl transition duration-200 flex justify-center items-center gap-2 hover:bg-red-50"
          >
            <FiLogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.08)] z-50 border-t border-gray-100">
        <div className="grid grid-cols-5 h-24 relative">
          {/* Indicador animado que se move */}
          <div
            className="absolute top-0 h-1 bg-gradient-to-r from-purple-600 to-purple-500 rounded-b-full transition-all duration-200 ease-out"
            style={{
              left: `calc(${navItems.findIndex((item) => item.path === pathname) * 20}%)`,
              width: "20%",
            }}
          />

          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-300 ${
                  isActive
                    ? "text-purple-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {/* Ícone com escala animada */}
                <div
                  className={`transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}
                >
                  {item.icon}
                </div>

                {/* Label com background sutil quando ativo */}
                {isActive && (
                  <span className="text-[11px] font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full transition-all duration-300">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-red-500 transition-colors duration-300"
          >
            <div className="transition-transform duration-300 hover:scale-110">
              <FiLogOut size={28} />
            </div>
          </button>
        </div>
      </nav>
    </>
  );
}
