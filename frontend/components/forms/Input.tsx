import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full rounded-lg border-2 border-[var(--primary-color)]/20 px-4 py-3 text-gray-900 
                   placeholder-[var(--text-primary)]/50 shadow-sm focus:border-[var(--primary-color)] focus:ring-2 
                   focus:ring-[var(--primary-color)]/30 focus:outline-none transition duration-200"
      />
    </div>
  );
}
