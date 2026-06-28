"use client";

import { listaBancosPopulares } from "@/hooks/useContas";
import { getIconeCategoria } from "@/lib/categoriaUtils";
import { Landmark } from "lucide-react";

export default function CarrosselBancos() {
  // A lista original
  const bancos = [
    "Nubank",
    "Itaú",
    "Santander",
    "Bradesco",
    "Banco Inter",
    "C6 Bank",
    "BTG Pactual",
    "Caixa Econômica",
  ];

  // Triplicamos a lista para garantir que a tela sempre esteja preenchida durante o scroll
  const listaInfinita = [...bancos, ...bancos, ...bancos];
  const getBancoLogo = (instituicao: string) => {
    const banco = listaBancosPopulares.find(
      (b) => b.nome.toLowerCase() === instituicao.toLowerCase(),
    );
    return banco?.logo || "/bancos/default.png";
  };
  
  return (
    <section className="w-full py-12 bg-transparent overflow-hidden flex flex-col items-center">
      
      <p className="text-[var(--text-muted)] text-sm font-medium uppercase tracking-widest mb-8 text-center px-4">
        Centralize as despesas das suas contas
      </p>

      {/* Container com máscara de degradê para as bordas sumirem suavemente */}
      <div 
        className="w-full max-w-full mx-auto overflow-hidden relative"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
        }}
      >
        {/* A Trilha que se move */}
        <div className="flex w-max animate-infinite-scroll items-center">
          {listaInfinita.map((banco, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 mx-8 text-[var(--text-muted)] grayscale-100 opacity-50 hover:opacity-100 hover:grayscale-0  duration-300 cursor-default"
            >
                <img width={50} className="rounded-md" src={getBancoLogo(banco)} alt="" />
              <span className="text-2xl font-semibold tracking-tight whitespace-nowrap">
                {banco}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}