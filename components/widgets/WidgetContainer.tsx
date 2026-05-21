import React from "react";

interface WidgetContainerProps {
  titulo: string;
  subtitulo?: string;
  rodape?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// components/widgets/WidgetContainer.tsx

export default function WidgetContainer({
  titulo,
  rodape,
  children,
  subtitulo,
  className = "",
}: WidgetContainerProps) {
  return (
    <article
      className={`flex flex-col h-full bg-white  rounded-lg shadow-sm border border-gray-100  transition-colors ${className}`}
    >
      <div className="p-4 border-b border-gray-100 ">
        <h2 className="text-lg font-medium text-gray-900">
          {titulo}
        </h2>
        {subtitulo && <p className="text-xs text-gray-500">{subtitulo}</p>}
      </div>

      <div className="p-0 flex-1">{children}</div>

      {rodape && (
        <div className="p-3 border-t border-gray-100  text-center mt-auto">
          {rodape}
        </div>
      )}
    </article>
  );
}
