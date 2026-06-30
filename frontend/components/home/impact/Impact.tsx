import { ReactNode } from "react";

interface ImpactCardProps {
  children: ReactNode;
}

function ImpactCard({ children }: ImpactCardProps) {
  return (
    <li
      className="flex items-start gap-4 p-5 rounded-2xl 
      bg-[var(--bg-surface)]/30 
      border border-black/5 dark:border-white/10 
      shadow-lg 
      backdrop-blur-lg 
      transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full 
        bg-[var(--primary-color)]/20 
        flex items-center justify-center mt-0.5 
        shadow-inner backdrop-blur-sm"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-color)]"></div>
      </div>

      <p className="text-[var(--text-primary)] leading-relaxed">
        {children}
      </p>
    </li>
  );
}

export default function Impact() {
  return (
    <article className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-16 px-6 gap-10 text-center">
      
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Seu dinheiro conta uma{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
            história.
          </span>
        </h1>
        <h2 className="text-xl sm:text-2xl font-medium text-[var(--text-secondary)]">
          Você está acompanhando ela?
        </h2>
      </div>

      <ul className="flex flex-col gap-4 w-full max-w-3xl text-left mt-2 relative">
        {/* Glow de fundo */}
        <div className="absolute inset-0 bg-[var(--primary-color)]/10 blur-3xl -z-10 rounded-full" />
        
        <ImpactCard>
          Cada compra, investimento ou economia influencia seus objetivos.
        </ImpactCard>
        
        <ImpactCard>
          Sem organização, decisões importantes se tornam apostas.
        </ImpactCard>
        
        <ImpactCard>
          Com informação, elas se tornam{" "}
          {/* Ajustado: Herdando a cor base, mas mantendo o negrito */}
          <strong className="font-bold text-[var(--primary-color)]">
            estratégias.
          </strong>
        </ImpactCard>
      </ul>
      
    </article>
  );
}