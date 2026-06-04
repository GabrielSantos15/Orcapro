import { Heart, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import React from "react";

interface CardFeatureProps {
  titulo: string;
  texto: string;
  icone: React.ReactNode;
  destaque?: boolean;
}

function CardFeature({ titulo, texto, icone, destaque = false }: CardFeatureProps) {
  return (
    <div
      className={`p-8 rounded-[2rem] border flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300 ${
        destaque
          ? "bg-[var(--text-primary)] border-[var(--border-color)] shadow-xl "
          : "bg-[var(--bg-surface)] border-[var(--border-color)]"
      }`}
    >
      <div className="p-3 bg-[var(--bg-secondary)] rounded-2xl shadow-sm">
        {icone}
      </div>
      <h3
        className={`text-xl font-bold ${
          destaque ? "text-[var(--bg-primary)]" : "text-[var(--text-primary)]"
        }`}
      >
        {titulo}
      </h3>
      <p className="text-[var(--text-secondary)] leading-relaxed">{texto}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section className="py-20 px-6 md:px-12">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <article className="flex flex-col items-start text-left">
          <span className="text-[var(--primary-color)] font-bold uppercase tracking-wider text-sm mb-4">
            Recursos
          </span>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-[var(--text-primary)] mb-6 leading-tight">
            Tudo o que você precisa para dominar suas finanças.
          </h2>

          <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed max-w-lg">
            O OrçaPro não é apenas um rastreador de despesas, é o seu
            ecossistema financeiro. Desenvolvido para simplificar o complexo,
            ele poupa seu tempo e elimina o estresse de lidar com planilhas
            manuais.
          </p>
        </article>

        <div className="grid sm:grid-cols-2 gap-6 relative">
          <div className="absolute inset-0 bg-[var(--primary-color)]/10 blur-3xl -z-10 rounded-full" />

          <CardFeature
            titulo="Segurança em foco"
            texto="Seus dados são processados com os mais altos padrões de proteção e privacidade."
            icone={<ShieldCheck className="w-8 h-8 text-[var(--primary-color)]" strokeWidth={1.5} />}
          />

          <CardFeature
            titulo="Visão 360º"
            texto="Acompanhe cada centavo em tempo real com gráficos e categorização inteligente."
            icone={<LineChart className="w-8 h-8 text-[var(--primary-color)]" strokeWidth={1.5} />}
            destaque
          />

          <CardFeature
            titulo="Inteligência"
            texto="Extraia insights valiosos sobre seus hábitos e saiba exatamente onde economizar."
            icone={<Sparkles className="w-8 h-8 text-[var(--primary-color)]" strokeWidth={1.5} />}
          />

          <CardFeature
            titulo="Simplicidade"
            texto="Design focado na sua experiência. Controle seu dinheiro de qualquer dispositivo."
            icone={<Heart className="w-8 h-8 text-[var(--primary-color)]" strokeWidth={1.5} />}
          />
        </div>
      </div>
    </section>
  );
}
