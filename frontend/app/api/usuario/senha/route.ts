import { forwardToBackend } from "@/lib/server/api";

export async function PUT(request: Request) {
  const body = await request.json();

  const { data, status, ok } = await forwardToBackend("/api/usuario/senha", {
    method: "PUT",
    body,
  });

  if (!ok) {
    return Response.json(
      { error: data?.error || data?.message || "Erro ao alterar a senha" },
      { status },
    );
  }

  return new Response(null, { status });
}