// components/widgets/WidgetContainer.tsx
import React from "react";

interface WidgetContainerProps {
  icon?: React.ReactNode
  titulo: string;
  subtitulo?: string;
  headerAction?: React.ReactNode; 
  rodape?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function WidgetContainer({
  icon,
  titulo,
  subtitulo,
  headerAction,
  rodape,
  children,
  className = "",
}: WidgetContainerProps) {
  return (
    <article
      className={`flex flex-col h-full bg-[var(--bg-surface)]  rounded-lg shadow-sm border border-[var(--border-color)] transition-colors ${className}`}
    >
      <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center gap-4">
        <div className="flex gap-2 items-center">
          {icon && icon}
          <h2 className="text-lg font-medium text-[var(--text-primary)]">{titulo}</h2>
          {subtitulo && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitulo}</p>
          )}
        </div>

        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>

      <div className="p-0 flex-1">{children}</div>

      {rodape && (
        <div className="mt-auto border-t border-[var(--border-color)]">{rodape}</div>
      )}
    </article>
  );
}
