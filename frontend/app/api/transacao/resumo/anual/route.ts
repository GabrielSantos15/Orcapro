import { forwardToBackend } from "@/lib/server/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const ano = searchParams.get("ano");

  if (!ano || !ano) {
    return Response.json(
      { error: "Os parâmetro 'ano' é obrigatório para gerar o resumo." },
      { status: 400 }
    );
  }

  const queryString = searchParams.toString();
  const endpoint = `/api/transacao/resumo/anual?${queryString}`;

  const { data, status, ok } = await forwardToBackend(endpoint);

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao buscar resumo anual" },
      { status }
    );
  }

  return Response.json(data);
}