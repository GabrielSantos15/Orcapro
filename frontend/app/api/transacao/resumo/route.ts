import { forwardToBackend } from "@/lib/server/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const queryString = searchParams.toString();

  const endpoint = queryString
    ? `/api/transacao/resumo?${queryString}`
    : "/api/transacao/resumo";

  const { data, status, ok } = await forwardToBackend(endpoint);

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao buscar resumo" },
      { status }
    );
  }

  return Response.json(data);
}