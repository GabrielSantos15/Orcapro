import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="mb-2 text-sm font-medium">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full rounded-lg outline-hidden border border-[var(--primary-color)]/50 px-4 py-3 
                   placeholder-[var(--text-primary)]/50 shadow-sm focus:outline-2 hover:outline-[var(--primary-color)]/20 focus:ring-2 
                   focus:ring-[var(--primary-color)]/30 focus:outline-none transition duration-200"
      />
    </div>
  );
}
