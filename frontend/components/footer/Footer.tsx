import { FaGithub, FaLinkedinIn, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] pt-12 pb-8 text-[var(--text-secondary)] border-t border-[var(--border-color)]">
      {/* --- GRID DO FOOTER --- */}
      <div className="max-w-7xl mx-auto px-4 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        <div>
          <h2 className="text-4xl font-bold mb-8 ">
            <span className="">Orça</span>
            <span className="text-[var(--primary-color)]">Pro</span>
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
            Simplificando sua vida financeira com clareza e praticidade. Projeto desenvolvido na FIAP.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-base font-semibold uppercase tracking-wider">Navegação</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><a href="#beneficits" className="hover:text-[var(--primary-color)] transition-colors">Sobre o Projeto</a></li>
            <li><a href="#features" className="hover:text-[var(--primary-color)] transition-colors">Funcionalidades</a></li>
            <li><a href="#transparencia" className="hover:text-[var(--primary-color)] transition-colors">Transparência</a></li>
            <li><a href="https://github.com/GabrielSantos15/Orcapro" className="hover:text-[var(--primary-color)] transition-colors">Repositório GitHub</a></li>
          </ul>
        </div>

        {/* Redes sociais */}
        <div>
          <h3 className="text-base font-semibold uppercase tracking-wider">Conecte-se</h3>
          <p className="text-sm mt-2 text-[var(--text-secondary)]">
            Gostou da interface? Apoie o desenvolvedor nas redes:
          </p>
          <div className="mt-4 flex flex-wrap gap-5">
            <a
              href="https://www.linkedin.com/in/gabrielsantos1509/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--primary-color)] flex gap-2 items-center text-base font-medium transition-colors"
            >
              <FaLinkedinIn className="text-lg text-blue-400" /> LinkedIn
            </a>
            <a
              href="https://github.com/GabrielSantos15"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--primary-color)] flex gap-2 items-center text-base font-medium transition-color"
            >
              <FaGithub className="text-lg" /> GitHub
            </a>
            <a
              href="mailto:gabriel.santos.tech256@gmail.com"
              className="hover:text-[var(--primary-color)] flex gap-2 items-center text-base font-medium transition-color"
            >
             <FaEnvelope  className="text-lg" /> Email
            </a>
          </div>
        </div>

      </div>

      {/* Linha inferior */}
      <div className="max-w-7xl mx-auto px-4 lg:px-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© {new Date().getFullYear()} OrçaPro. Todos os direitos reservados.</p>
        <p>
          Desenvolvido por{' '}
          <a
            href="https://gabrielsantos-portfolio.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--text-secondary)] font-medium hover:text-[var(--primary-color)] transition-colors underline decoration-gray-600"
          >
            Gabriel dos Santos
          </a>
        </p>
      </div>
    </footer>
  );
}