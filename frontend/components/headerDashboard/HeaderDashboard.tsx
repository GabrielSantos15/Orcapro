"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

import { User, Shield, Palette, Tags, Bell, LogOut, X, Router } from "lucide-react";
import { subtle } from "crypto";
import { useUsuario } from "@/hooks/useUsuario";

interface HeaderDashboardProps {
  showWelcome?: boolean;
  title?: string;
  subTitle?: string;
}


export default function HeaderDashboard({
  showWelcome = false,
  title,
  subTitle,
}: HeaderDashboardProps) {
  const { user, isLoading } = useAuth();
  const { avatarUrl } = useUsuario();

  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const firstName = user?.nome?.split(" ")[0] ?? "Usuário";

  const accountMenu = [
    {
      label: "Meu Perfil",
      href: "/dashboard/conta",
      icon: User,
    },
    {
      label: "Aparência",
      href: "/dashboard/conta/aparencia",
      icon: Palette,
    },
    {
      label: "Categorias",
      href: "/dashboard/conta/categorias",
      icon: Tags,
    },

  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileDrawerOpen(false);
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    if (confirm("Tem certeza que deseja sair?")) {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/");
    }
  };

  function AccountMenuContent() {
    return (
      <>
        {accountMenu.map((item) => {
          const Icon = item.icon;

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl transition-all
                ${isActive
                  ? "bg-[var(--primary-color)]/10 text-[var(--primary-color)]"
                  : "hover:bg-[var(--bg-secondary)]"
                }
              `}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <>
      {/* DESKTOP */}
      <header className="hidden md:flex justify-between items-center mb-6 pb-4">
        <div>
          {showWelcome ? (
            <>
              <h1 className="text-2xl font-medium flex align-baseline">
                Bem-vindo de volta, {" "}
                <span className="text-[var(--primary-color)]">{isLoading ? <div className="skeleton h-6 w-[90px] rounded-md inline-block" /> : firstName}</span>
                !
              </h1>

              <p className="text-sm text-[var(--text-secondary)] mt-1 capitalize">
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-medium">{title}</h1>
              {subTitle && (
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {subTitle}
                </p>
              )}
            </>
          )}
        </div>

        <div ref={menuRef} className="relative">
          {isLoading ? (
            <div className="flex items-center gap-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-full px-2 py-2 pr-4 w-56 ">
              <div className="w-[56px] h-[56px] rounded-full skeleton shrink-0"></div>

              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 skeleton rounded-md w-24"></div>
                <div className="h-3 skeleton rounded-md w-32"></div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-full px-2 py-2 pr-4 hover:bg-[var(--bg-secondary)] transition text-left"
            >
              <img
                src={avatarUrl}
                alt={user?.nome || "Avatar"}
                width={56}
                height={56}
                className="rounded-full shrink-0"
              />

              <div className="flex flex-col overflow-hidden">
                <h2 className="font-medium truncate">{user?.nome}</h2>
                <p className="text-sm text-[var(--text-secondary)] truncate">
                  {user?.email}
                </p>
              </div>
            </button>
          )}

          <div
            className={`
              absolute right-0 top-full mt-3 w-72
              bg-[var(--bg-surface)]
              border border-[var(--border-color)]
              rounded-3xl
              shadow-xl
              overflow-hidden
              z-50
              transition-all duration-200
              ${isMenuOpen
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible translate-y-2"
              }
            `}
          >
            <div className="p-4 border-b border-[var(--border-color)]">
              <p className="font-medium">{user?.nome}</p>

              <p className="text-sm text-[var(--text-secondary)]">
                {user?.email}
              </p>
            </div>

            <div className="p-2">
              <AccountMenuContent />
            </div>

            <div className="border-t border-[var(--border-color)] p-2">
              <button
                className="
                  w-full
                  flex items-center gap-3
                  px-4 py-3
                  rounded-2xl
                  text-red-500
                  hover:bg-red-500/10
                  transition
                  cursor-pointer
                "
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Sair da conta
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE */}
      <header className="relative flex justify-between items-center mb-6 md:hidden">
        <div>
          {showWelcome ? (
            <>
              <h1 className="text-3xl font-semibold text-white">Bem-vindo,</h1>

              <h2 className="text-3xl font-bold text-white">{firstName}!</h2>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-white backdrop-blur-md">{title}</h1>
              {subTitle && (
                <p className="text-sm text-white/80 mt-1">
                  {subTitle}
                </p>
              )}
            </>
          )}
        </div>

        <button onClick={() => setIsMobileDrawerOpen(true)}>
          <img
            src={avatarUrl}
            alt={user?.nome || "Avatar"}
            width={70}
            height={70}
            className="rounded-full border-2 border-white/20"
          />
        </button>

        <div
          className="
            absolute top-0 left-0 right-0
            h-[220px]
            bg-gradient-to-r
            from-[var(--primary-color)]
              to-[var(--secondary-color)]
            rounded-b-[2.5rem]
            -z-10
            -mx-8
            -mt-8
          "
        />
      </header>

      {/* OVERLAY */}
      <div
        onClick={() => setIsMobileDrawerOpen(false)}
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all
          ${isMobileDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* DRAWER */}
      <aside
        className={`
          fixed top-0 right-0
          h-screen w-[85vw] max-w-sm
          bg-[var(--bg-surface)]
          shadow-2xl
          z-50
          transition-transform duration-300
          ${isMobileDrawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6 border-b border-[var(--border-color)]">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Conta</h2>

            <button onClick={() => setIsMobileDrawerOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <img
              src={avatarUrl}
              alt={user?.nome || "Avatar"}
              width={60}
              height={60}
              className="rounded-full"
            />

            <div>
              <p className="font-medium">{user?.nome}</p>

              <p className="text-sm text-[var(--text-secondary)]">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-3">
          <AccountMenuContent />
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="
              w-full
              flex items-center justify-center gap-2
              px-4 py-4
              rounded-2xl
              bg-red-500/10
              text-red-500
            "
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}
