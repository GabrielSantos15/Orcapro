"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ServerWakeUp() {
  const [serverActive, setServerActive] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const hasPinged = useRef(false);

  useEffect(() => {
    if (hasPinged.current) return;
    hasPinged.current = true;

    const timeout = setTimeout(() => {
      setShowCard(true);
    }, 5000);

    fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao acordar API");

        clearTimeout(timeout);

        const mostrouCard = showCard;

        setServerActive(true);
        setShowCard(false);

        if (mostrouCard) {
          toast.success("Servidor pronto!");
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        setShowCard(true);
      });

    return () => clearTimeout(timeout);
  }, []);

  if (serverActive || !showCard) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-right duration-500">
      <div className="rounded-xl border border-[var(--primary-color)]/30 bg-[var(--bg-primary)] shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--primary-color)] mt-0.5" />

          <div>
            <h3 className="font-semibold text-sm">
              Preparando ambiente de demonstração
            </h3>

            <p className="text-sm text-muted-foreground mt-1">
              O backend está iniciando em um ambiente gratuito.
              Isso pode levar até 50 segundos na primeira visita.
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-[var(--primary-color)]">
              <span className="h-2 w-2 rounded-full bg-[var(--primary-color)] animate-pulse" />
              Inicializando serviços...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}