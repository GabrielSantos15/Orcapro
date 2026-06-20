"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function ServerWakeUp() {
  const hasPinged = useRef(false);

  useEffect(() => {
    if (hasPinged.current) return;
    hasPinged.current = true;

    // Removemos o 'await' para passar a Promise diretamente para o Sonner
    const wakeUpServer = fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao acordar API");
        return res;
      });

    toast.promise(wakeUpServer, {
      loading: 'Iniciando servidor seguro... (Pode levar até 50s)',
      success: 'Servidor Ativo! O sistema está pronto.',
      error: 'Erro ao conectar com o servidor.',
      duration: 4000, 
    });
  }, []);

  return null; 
}