import { forwardToBackend } from "@/lib/server/api";

export async function GET() {
  const { data, status, ok } = await forwardToBackend("/api/transacao");

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao buscar transações" },
      { status },
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
