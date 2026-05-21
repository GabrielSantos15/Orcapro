'use client'

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaChartPie, FaExchangeAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    router.push('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <FaChartPie /> },
    { label: 'Movimentações', path: '/dashboard/movimentacao', icon: <FaExchangeAlt/> },
    { label: 'Metas', path: '/dashboard/metas', icon: null },
  ];

  return (
    <aside className="bg-[var(--secondary-background)] p-6 h-full flex flex-col mb-3">
      <h1 className="text-4xl font-bold">
        <span className="text-purple-600">Orça</span>
        <span className="text-purple-400">Pro</span>
      </h1>
      <nav className="flex-1 flex flex-col gap-3 justify-start">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              pathname === item.path
                ? 'bg-purple-600 text-white font-semibold'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-gray-300 pt-4">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 text-red font-semibold rounded-lg transition duration-200 flex justify-center items-center gap-1 hover:bg-red-100"
        >
          <FiLogOut /> Sair
        </button>
      </div>
    </aside>
  );
}
