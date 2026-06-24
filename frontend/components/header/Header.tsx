"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../themeToggle/ThemeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky z-50 top-0 w-full mx-auto bg-[var(--bg-surface)] border-b border-[var(--border-color)]">
      <div className="flex justify-between items-center px-6 py-4 mx-auto">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold tracking-tight z-50">
          <span className="text-[var(--text-primary)]">Orça</span>
          <span className="text-[var(--primary-color)]">Pro</span>
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
          <ul className="flex gap-8 text-[var(--text-secondary)] font-medium">
            <li>
              <Link href="/" className="hover:text-[var(--primary-color)] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="#sobre" className="hover:text-[var(--primary-color)] transition-colors">
                Sobre
              </Link>
            </li>
            <li>
              <Link href="#contato" className="hover:text-[var(--primary-color)] transition-colors">
                Contato
              </Link>
            </li>
          </ul>
        </nav>

        {/* AÇÕES DESKTOP */}
        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="/login"
            className="text-base font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="px-6 py-2.5 text-base font-medium bg-[var(--primary-color)] text-[var(--bg-surface)] rounded-[var(--radius-full)] hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
          >
            Criar conta
          </Link>
          <div className="pl-2 border-l border-[var(--border-color)]">
            <ThemeToggle />
          </div>
        </div>

        {/* CONTROLES MOBILE (Menu Sanduíche + Tema) */}
        <div className="flex md:hidden items-center gap-4 z-50">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] transition-colors"
            aria-label="Alternar menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MENU DROPDOWN MOBILE */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[var(--bg-surface)] border-b border-[var(--border-color)] shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col p-6 gap-6">
          <ul className="flex flex-col gap-4 text-lg font-medium text-[var(--text-secondary)]">
            <li>
              <Link href="/" onClick={closeMenu} className="block hover:text-[var(--primary-color)]">
                Home
              </Link>
            </li>
            <li>
              <Link href="#sobre" onClick={closeMenu} className="block hover:text-[var(--primary-color)]">
                Sobre
              </Link>
            </li>
            <li>
              <Link href="#contato" onClick={closeMenu} className="block hover:text-[var(--primary-color)]">
                Contato
              </Link>
            </li>
          </ul>

          <hr className="border-[var(--border-color)]" />

          <div className="flex flex-col gap-4">
            <Link
              href="/login"
              onClick={closeMenu}
              className="text-center py-3 text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded-[var(--radius-md)] transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              onClick={closeMenu}
              className="text-center py-3 text-base font-medium bg-[var(--primary-color)] text-[var(--bg-surface)] rounded-[var(--radius-full)] hover:bg-[var(--primary-hover)] transition-colors"
            >
              Criar conta
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}