"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isCurrency?: boolean;
}

export default function Input({ label, type, isCurrency, className = "", onChange, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  let finalType = type;
  if (type === "password") {
    finalType = showPassword ? "text" : "password";
  } else if (isCurrency) {
    finalType = "tel"; 
  }

  // Máscara de moeda
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCurrency) {
      let value = e.target.value.replace(/\D/g, "");
      
      if (!value) {
        e.target.value = "";
      } else {
        const numericValue = parseInt(value, 10) / 100;
        e.target.value = new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(numericValue);
      }
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="mb-2 text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {/* Prefixo de Moeda */}
        {isCurrency && (
          <span className="absolute left-4 text-[var(--text-secondary)] pointer-events-none">
            R$
          </span>
        )}

        <input
          type={finalType}
          onChange={handleChange}
          {...props}
          className={`
            w-full rounded-lg py-3 shadow-sm transition duration-200 focus:outline-none
            bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)]
            border border-[var(--border-input)] 
            hover:border-[var(--primary-color)]/70 
            focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/30
            ${isCurrency ? "pl-11 pr-4" : "px-4"} 
            ${type === "password" ? "pr-12" : ""}
            ${className}
          `}
        />

        {/* Ícone de Senha */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors flex items-center justify-center"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}