import { forwardToBackend } from "@/lib/server/api";

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
     const queryString = searchParams.toString();
  const { data, status, ok } = await forwardToBackend(`/api/orcamento?${queryString}`, {
    method: "GET",
  });

  if (!ok) {
    return Response.json(
      { error: data?.error || data?.message || "Erro ao buscar os orçamentos" },
      { status },
    );
  }

  return Response.json(data, { status });
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, status, ok } = await forwardToBackend("/api/orcamento", {
    method: "POST",
    body,
  });

  if (!ok) {
    return Response.json(
      { error: data?.error || data?.message || "Erro ao criar o orçamento" },
      { status },
    );
  }

  return Response.json(data, { status });
}