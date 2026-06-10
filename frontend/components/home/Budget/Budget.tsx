export default function Budget() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto py-20 px-6 gap-12 lg:gap-20">
      
      {/* Lado Esquerdo: Texto de Impacto */}
      <div className="flex-1 flex flex-col gap-5 text-center lg:text-left">
        <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-[var(--primary-color)] font-semibold tracking-wide uppercase text-sm mb-2">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Orçamentos Inteligentes
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--text-primary)]">
          Defina limites.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
            Mantenha a liberdade.
          </span>
        </h2>
        
        <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
          Crie limites de gastos por categoria e saiba exatamente quanto você ainda pode gastar até o fim do mês, sem culpa e sem surpresas.
        </p>
      </div>

      {/* Lado Direito: Simulação da Interface (UI Mockup) */}
      <div className="flex-1 w-full max-w-md relative group">
        
        {/* Glow de fundo para destacar a UI */}
        <div className="absolute inset-0 bg-[var(--primary-color)]/20 blur-3xl -z-10 rounded-[3rem] transition-all group-hover:bg-[var(--primary-color)]/30" />

        {/* Card simulando o App */}
        <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)]/60 border border-black/5 dark:border-white/10 shadow-2xl backdrop-blur-xl">
          
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-[var(--text-primary)] font-medium text-lg">Novembro</h3>
            <span className="text-[var(--text-secondary)] text-sm">Restam 12 dias</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-primary)] font-medium">Mercado</span>
              <span className="text-neutral-500"><strong className="text-[var(--text-primary)]">R$ 850</strong> / R$ 1.000</span>
            </div>
            <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/5 overflow-hidden">
              {/* Barra de progresso Laranja (Atenção) */}
              <div className="h-full bg-orange-500 rounded-full w-[85%] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-primary)] font-medium">Lazer</span>
              <span className="text-neutral-500"><strong className="text-[var(--text-primary)]">R$ 150</strong> / R$ 400</span>
            </div>
            <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/5 overflow-hidden">
              {/* Barra de progresso na Cor Primária (Seguro) */}
              <div className="h-full bg-[var(--primary-color)] rounded-full w-[37.5%] transition-all duration-1000 ease-out shadow-[0_0_10px_var(--primary-color)] opacity-80"></div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-primary)] font-medium">Transporte</span>
              <span className="text-neutral-500"><strong className="text-[var(--text-primary)]">R$ 180</strong> / R$ 300</span>
            </div>
            <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/5 overflow-hidden">
              {/* Barra de progresso Amarela */}
              <div className="h-full bg-yellow-500 rounded-full w-[60%] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}