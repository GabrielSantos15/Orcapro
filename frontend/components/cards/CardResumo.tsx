import { formatarMoeda } from "@/lib/utils";
import { LucideIcon, Wallet } from "lucide-react";
import React from "react";

interface CardResumoProps {
  value: number;
  title: string;
  subtitle?: string;
  color?: string;
  isLoading?: boolean;
  icon?: LucideIcon;
  variant?: "default" | "highlight";
  className?: string
}

export default function CardResumo({
  value,
  title,
  variant = "default",
  icon: Icon = Wallet,
  color,
  isLoading = true,
  className
}: CardResumoProps) {

  const isHighlight = variant === "highlight";


  return (
    <article
      className={`flex flex-col justify-center gap-3 rounded-xl p-5 transition-all duration-300 w-full h-full ${className ?? ""} 
    ${isHighlight
          ? "bg-[#0B1015] border-white/10 text-white light-effect"
          : "bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-sm"
        }`}
    >

      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${isHighlight
            ? "bg-white/20 text-white"
            : "bg-[var(--bg-primary)] text-[var(--primary-color)]"
            }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <h3 className={`font-medium ${isHighlight && "text-white/80"}`}>{title}</h3>
      </div>

      {isLoading ? (
        <div className="skeleton h-8 w-full rounded-md opacity-30"></div>
      ) : (
        <p
          className="text-2xl font-semibold tracking-tight"
          style={{ color: isHighlight ? "#ffffff" : color }}
        >
          {formatarMoeda(value)}
        </p>

      )}
    </article>
  );
}
