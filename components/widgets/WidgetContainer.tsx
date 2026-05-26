// components/widgets/WidgetContainer.tsx
import React from "react";

interface WidgetContainerProps {
  titulo: string;
  subtitulo?: string;
  headerAction?: React.ReactNode; // 👈 Adicionamos a prop para o botão
  rodape?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function WidgetContainer({
  titulo,
  subtitulo,
  headerAction,
  rodape,
  children,
  className = "",
}: WidgetContainerProps) {
  return (
    <article
      className={`flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-100 transition-colors ${className}`}
    >
      <div className="p-4 border-b border-gray-100 flex justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{titulo}</h2>
          {subtitulo && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitulo}</p>
          )}
        </div>

        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>

      <div className="p-0 flex-1">{children}</div>

      {rodape && (
        <div className="mt-auto border-t border-gray-100">{rodape}</div>
      )}
    </article>
  );
}
