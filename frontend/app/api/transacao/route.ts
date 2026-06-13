import { forwardToBackend } from "@/lib/server/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const queryString = searchParams.toString();

  const endpoint = queryString
    ? `/api/transacao?${queryString}`
    : "/api/transacao";

  const { data, status, ok } = await forwardToBackend(endpoint);

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao buscar transações" },
      { status }
    );
  }

  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, status, ok } = await forwardToBackend("/api/transacao", {
    method: "POST",
    body,
  });

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao criar transação" },
      { status },
    );
  }

  return Response.json(data, { status });
}
