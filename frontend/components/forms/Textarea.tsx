import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="mb-2 text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <textarea
        {...props}
        rows={props.rows || 4}
        className={`
          w-full rounded-lg py-3 px-4 shadow-sm transition duration-200 focus:outline-none resize-y
          bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)]
          border border-[var(--border-input)] 
          hover:border-[var(--primary-color)]/70 
          focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/30
          ${className}
        `}
      />
    </div>
  );
}