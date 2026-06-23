"use client";

import { BadgeDollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaChartPie, FaExchangeAlt, FaBullseye, FaSlidersH } from "react-icons/fa";
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
    {
      label: "Orçamento",
      path: "/dashboard/orcamento",
      icon: <FaSlidersH size={24} />,
    },
  ];

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex bg-[var(--bg-secondary)] p-6 h-screen sticky top-0 border-r border-[var(--border-color)] z-40 w-64 flex-col">
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
        <div className="border-t border-[var(--border-color)] pt-6 mt-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 text-red-500 font-semibold rounded-xl transition duration-200 flex justify-center items-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
          >
            <FiLogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* Sidebar Table */}
      <aside className="hidden md:flex lg:hidden bg-[var(--bg-secondary)] py-6 px-3 h-screen sticky top-0 border-r border-[var(--border-color)] z-40 w-20 flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-center cursor-default" title="OrçaPro">
          <span className="">O</span>
          <span className="text-[var(--primary-color)]">P</span>
        </h1>

        <nav className="flex-1 flex flex-col gap-4 w-full">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              title={item.label}
              className={`flex items-center justify-center py-3 rounded-xl transition-all w-full ${
                pathname === item.path
                  ? "bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white shadow-md"
                  : "text-[var(--text-muted)] hover:bg-[var(--primary-color)]/10 hover:text-[var(--primary-hover)] dark:hover:text-white"
              }`}
            >
              {item.icon}
            </Link>
          ))}
        </nav>

        <div className="mb-6 flex justify-center w-full">
          <ThemeToggle />
        </div>
        
        <div className="border-t border-[var(--border-color)] pt-6 mt-2 w-full flex justify-center">
          <button
            onClick={handleLogout}
            title="Sair"
            className="w-full py-3 flex justify-center items-center text-red-500 rounded-xl transition duration-200 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
          >
            <FiLogOut size={24} />
          </button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--bg-surface)] rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.5)] z-50 border-t border-[var(--border-color)] overflow-hidden">
        <div className="grid grid-cols-5 h-24 relative">
          {/* Indicador */}
          <div
            className="absolute top-0 h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] rounded-b-full transition-all duration-400 ease-out"
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
                className={`flex flex-col items-center justify-center gap-2 relative transition-all duration-300 ${
                  isActive
                    ? "text-[var(--primary-color)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {/* Ícone */}
                <div
                  className={`transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}
                >
                  {item.icon}
                </div>

                {/* Label */}
                {isActive && (
                  <span className="text-[11px] font-semibold bg-[var(--primary-color)]/10 text-[var(--primary-color)] px-2 py-1 rounded-full transition-all duration-300">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}