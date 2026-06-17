import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export default function Select({ label, children, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="mb-2 text-sm text-[var(--text-secondary)]">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          {...props}
          className={`
            w-full appearance-none rounded-lg px-4 py-3 pr-10 shadow-sm transition duration-200 cursor-pointer focus:outline-none
            bg-[var(--bg-input)] text-[var(--text-primary)]
            border border-[var(--border-input)] 
            hover:border-[var(--primary-color)]/70 
            focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/30
            [&>option]:bg-[var(--bg-surface)] [&>option]:text-[var(--text-primary)]
            ${className}
          `}
        >
          {children}
        </select>

        <ChevronDown
          size={20}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
      </div>
    </div>
  );
}