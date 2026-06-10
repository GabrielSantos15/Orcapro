import Link from "next/link";

export default function CtaStrip() {
  return (
    <section className="w-full px-6 py-12 sm:py-20">
      <div className="relative w-full max-w-7xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] p-10 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="flex flex-col gap-3 text-center md:text-left z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-sm">
            Pronto para assumir o controle?
          </h2>
          <p className="text-white/90 text-lg max-w-lg font-medium">
            Junte-se a milhares de pessoas que já pararam de tentar adivinhar e começaram a direcionar seu próprio dinheiro.
          </p>
        </div>

        <div className="z-10 flex-shrink-0">
          <Link href={"/cadastro"} className="px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-full transition-all hover:scale-105 hover:shadow-xl hover:bg-black dark:hover:bg-neutral-100 active:scale-95">
            Criar conta gratuita
          </Link>
        </div>

      </div>
    </section>
  );
}