import { forwardToBackend } from "@/lib/server/api";

export async function GET(request: Request) {
  const { data, status, ok } = await forwardToBackend("/api/investimento");

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao buscar investimentos" },
      { status }
    );
  }

  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, status, ok } = await forwardToBackend("/api/investimento", {
    method: "POST",
    body,
  });

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao criar investimento" },
      { status }
    );
  }

  return Response.json(data, { status: 201 });
}