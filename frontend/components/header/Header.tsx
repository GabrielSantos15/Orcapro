import Link from "next/link";
import ThemeToggle from "../themeToggle/ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 w-full mx-auto p-3 flex justify-between items-center bg-[var(--bg-surface)] ">
      <nav>
        <ul className="flex gap-3 mx-3">
          <Link href="/">Home</Link>
          <li>Sobre</li>
          <li>Contato</li>
        </ul>
      </nav>
      <div className="text-2xl font-bold tracking-tight">
        <span className="text-slate-900 dark:text-white">Orça</span>
        <span className="text-[var(--primary-color)]">Pro</span>
      </div>
      <div className="flex gap-4 sm:gap-6 items-center">
        <Link
          href="/login"
          className="px-2 py-2 text-base font-medium  text-slate-600 hover:text-slate-900 transition-colors"
        >
          Entrar
        </Link>
        <Link
          href="/cadastro"
          className="px-6 py-2.5 text-base font-medium bg-[var(--primary-color)] text-white rounded-full hover:bg-[var(--primary-hover)] transition-colors"
        >
          Criar conta
        </Link>
        <ThemeToggle></ThemeToggle>
      </div>
    </header>
  );
}
