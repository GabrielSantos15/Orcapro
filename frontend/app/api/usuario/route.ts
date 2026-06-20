import { forwardToBackend } from "@/lib/server/api";

export async function GET() {
  const { data, status, ok } = await forwardToBackend("/api/usuario");

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao buscar usuário" },
      { status },
    );
  }

  return Response.json(data, { status });
}

export async function PUT(request: Request) {
  const body = await request.json();

  const { data, status, ok } = await forwardToBackend("/api/usuario", {
    method: "PUT",
    body,
  });

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao atualizar usuário" },
      { status },
    );
  }

  return Response.json(data, { status });
}