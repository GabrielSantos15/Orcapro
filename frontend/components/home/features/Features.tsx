import { ReactNode } from "react";

// 1. Tipagem para os Cards de Funcionalidade
interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[var(--bg-primary)] border border-black/5 dark:border-white/10 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="w-12 h-12 rounded-xl bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)]">
        {icon}
      </div>
      
      <div>
        <h4 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          {title}
        </h4>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

// 3. Componente Principal da Seção
export default function Features() {
  return (
    <div className=" bg-[var(--bg-secondary)]">
      <section className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto py-20 px-6 gap-14" id="features">
      
        {/* Cabeçalho da Seção */}
        <div className="text-center flex flex-col gap-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Pare de apenas acompanhar seu dinheiro.
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
            Comece a direcioná-lo.
          </h3>
        </div>
        {/* Grid de Funcionalidades (1 coluna no mobile, 2 no desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      
          <FeatureCard
            title="Transações"
            description="Registre receitas e despesas de forma simples e mantenha suas finanças organizadas."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
          />
          <FeatureCard
            title="Investimentos"
            description="Acompanhe seus ativos e visualize sua evolução patrimonial em um só lugar."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          <FeatureCard
            title="Metas Financeiras"
            description="Economize com propósito e acompanhe seu progresso em tempo real."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
          />
          <FeatureCard
            title="Dashboard"
            description="Uma visão clara da sua vida financeira sempre que precisar."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            }
          />
        </div>
      </section>
    </div>
  );
}